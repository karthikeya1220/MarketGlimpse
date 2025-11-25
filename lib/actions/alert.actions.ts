'use server';

import { connectToDatabase } from '@/database/mongoose';
import { PriceAlertModel, type PriceAlert } from '@/database/models/alert.model';
import { logger } from '@/lib/logger';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { type ActionResult, successResult, errorResult } from '@/lib/action-types';
import { env } from '@/lib/env';
import { sendPriceAlertEmail } from '@/lib/nodemailer';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = env.FINNHUB_API_KEY;

interface FinnhubQuote {
  c: number; // Current price
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

async function fetchStockPrice(symbol: string): Promise<number | null> {
  try {
    const url = `${FINNHUB_BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      logger.error(`Finnhub API error for ${symbol}: ${response.status}`);
      return null;
    }
    
    const data: FinnhubQuote = await response.json();
    
    if (data.c && data.c > 0) {
      return data.c;
    }
    
    return null;
  } catch (error) {
    logger.error(`Failed to fetch price for ${symbol}`, error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

export interface CreateAlertData {
  symbol: string;
  company: string;
  targetPrice: number;
  condition: 'above' | 'below';
}

export async function getUserAlerts(): Promise<PriceAlert[]> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return [];
    }

    const alerts = await PriceAlertModel.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();
    
    return alerts.map((alert) => ({
      ...alert,
      _id: alert._id.toString(),
    })) as unknown as PriceAlert[];
  } catch (err) {
    logger.error('Failed to get user alerts', err instanceof Error ? err : new Error(String(err)));
    return [];
  }
}

export async function createPriceAlert(data: CreateAlertData): Promise<ActionResult<void>> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    if (!data.symbol || !data.company) {
      return errorResult('Symbol and company are required', 'VALIDATION_ERROR');
    }

    if (data.targetPrice <= 0) {
      return errorResult('Target price must be greater than 0', 'VALIDATION_ERROR');
    }

    if (!['above', 'below'].includes(data.condition)) {
      return errorResult('Invalid condition', 'VALIDATION_ERROR');
    }

    // Check if similar alert already exists
    const existing = await PriceAlertModel.findOne({
      userId: session.user.id,
      symbol: data.symbol.toUpperCase(),
      targetPrice: data.targetPrice,
      condition: data.condition,
      isActive: true,
      isTriggered: false,
    });

    if (existing) {
      return errorResult('Similar alert already exists', 'DUPLICATE_ERROR');
    }

    await PriceAlertModel.create({
      userId: session.user.id,
      symbol: data.symbol.toUpperCase(),
      company: data.company,
      targetPrice: data.targetPrice,
      condition: data.condition,
      isActive: true,
      isTriggered: false,
      notificationSent: false,
      createdAt: new Date(),
    });

    logger.info(`Created price alert for ${data.symbol} for user ${session.user.id}`);
    return successResult(undefined, 'Alert created successfully');
  } catch (err) {
    logger.error('Failed to create price alert', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to create alert', 'SERVER_ERROR');
  }
}

export async function deleteAlert(alertId: string): Promise<ActionResult<void>> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    const result = await PriceAlertModel.deleteOne({
      _id: alertId,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return errorResult('Alert not found', 'NOT_FOUND');
    }

    logger.info(`Deleted alert ${alertId} for user ${session.user.id}`);
    return successResult(undefined, 'Alert deleted');
  } catch (err) {
    logger.error('Failed to delete alert', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to delete alert', 'SERVER_ERROR');
  }
}

export async function toggleAlert(alertId: string, isActive: boolean): Promise<ActionResult<void>> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    const result = await PriceAlertModel.updateOne(
      { _id: alertId, userId: session.user.id },
      { $set: { isActive } }
    );

    if (result.matchedCount === 0) {
      return errorResult('Alert not found', 'NOT_FOUND');
    }

    logger.info(`Toggled alert ${alertId} to ${isActive} for user ${session.user.id}`);
    return successResult(undefined, isActive ? 'Alert activated' : 'Alert deactivated');
  } catch (err) {
    logger.error('Failed to toggle alert', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to toggle alert', 'SERVER_ERROR');
  }
}

// This will be called by Inngest background job
export async function checkPriceAlerts(): Promise<{
  checked: number;
  triggered: number;
  errors: number;
}> {
  try {
    await connectToDatabase();
    
    // Get all active, non-triggered alerts
    const alerts = await PriceAlertModel.find({
      isActive: true,
      isTriggered: false,
    }).populate('userId');

    logger.info(`Checking ${alerts.length} price alerts`);

    let triggered = 0;
    let errors = 0;

    // Check each alert
    for (const alert of alerts) {
      try {
        // Fetch current price
        const currentPrice = await fetchStockPrice(alert.symbol);
        
        if (currentPrice === null) {
          logger.warn(`Could not fetch price for ${alert.symbol}`);
          errors++;
          continue;
        }

        // Check if alert condition is met
        let shouldTrigger = false;
        
        if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          // Mark alert as triggered
          await PriceAlertModel.updateOne(
            { _id: alert._id },
            { 
              $set: { 
                isTriggered: true, 
                triggeredAt: new Date(),
                notificationSent: true 
              } 
            }
          );

          // Send email notification
          try {
            // Get user email - alert.userId should be populated
            const userId = alert.userId as unknown as { email: string; name: string };
            
            if (userId && userId.email) {
              await sendPriceAlertEmail({
                email: userId.email,
                symbol: alert.symbol,
                company: alert.company,
                currentPrice,
                targetPrice: alert.targetPrice,
                condition: alert.condition,
              });

              logger.info(`Sent alert email for ${alert.symbol} to ${userId.email}`);
            }
          } catch (emailError) {
            logger.error(
              `Failed to send alert email for ${alert.symbol}`,
              emailError instanceof Error ? emailError : new Error(String(emailError))
            );
            // Don't count as error - alert was still triggered
          }

          triggered++;
          logger.info(
            `Alert triggered: ${alert.symbol} ${alert.condition} ${alert.targetPrice} (current: ${currentPrice})`
          );
        }
      } catch (alertError) {
        logger.error(
          `Error processing alert for ${alert.symbol}`,
          alertError instanceof Error ? alertError : new Error(String(alertError))
        );
        errors++;
      }
    }

    return {
      checked: alerts.length,
      triggered,
      errors,
    };
  } catch (err) {
    logger.error('Failed to check price alerts', err instanceof Error ? err : new Error(String(err)));
    return {
      checked: 0,
      triggered: 0,
      errors: 1,
    };
  }
}
