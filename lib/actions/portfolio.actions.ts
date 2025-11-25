'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Portfolio, type PortfolioHolding } from '@/database/models/portfolio.model';
import { logger } from '@/lib/logger';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { type ActionResult, successResult, errorResult } from '@/lib/action-types';
import { env } from '@/lib/env';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const FINNHUB_API_KEY = env.FINNHUB_API_KEY;

export interface PortfolioHoldingWithMetrics extends PortfolioHolding {
  currentPrice?: number;
  currentValue?: number;
  totalCost?: number;
  profitLoss?: number;
  profitLossPercent?: number;
}

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
    
    // Finnhub returns 0 for invalid symbols or after-hours when no data
    if (data.c && data.c > 0) {
      return data.c;
    }
    
    return null;
  } catch (error) {
    logger.error(`Failed to fetch price for ${symbol}`, error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

export async function getUserPortfolio(): Promise<PortfolioHoldingWithMetrics[]> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return [];
    }

    const holdings = await Portfolio.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();
    
    // Fetch live prices for all holdings in parallel
    const holdingsWithPrices = await Promise.all(
      holdings.map(async (holding) => {
        const currentPrice = await fetchStockPrice(holding.symbol);
        const totalCost = holding.quantity * holding.buyPrice;
        const currentValue = currentPrice ? holding.quantity * currentPrice : undefined;
        const profitLoss = currentValue !== undefined ? currentValue - totalCost : undefined;
        const profitLossPercent = profitLoss !== undefined && totalCost > 0 
          ? (profitLoss / totalCost) * 100 
          : undefined;

        return {
          ...holding,
          _id: holding._id.toString(),
          currentPrice,
          currentValue,
          totalCost,
          profitLoss,
          profitLossPercent,
        };
      })
    );
    
    return holdingsWithPrices as unknown as PortfolioHoldingWithMetrics[];
  } catch (err) {
    logger.error('Failed to get user portfolio', err instanceof Error ? err : new Error(String(err)));
    return [];
  }
}

export interface AddPortfolioData {
  symbol: string;
  company: string;
  quantity: number;
  buyPrice: number;
  buyDate: string;
  notes?: string;
}

export async function addToPortfolio(data: AddPortfolioData): Promise<ActionResult<void>> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    // Validate inputs
    if (!data.symbol || !data.company) {
      return errorResult('Symbol and company are required', 'VALIDATION_ERROR');
    }

    if (data.quantity <= 0) {
      return errorResult('Quantity must be greater than 0', 'VALIDATION_ERROR');
    }

    if (data.buyPrice <= 0) {
      return errorResult('Buy price must be greater than 0', 'VALIDATION_ERROR');
    }

    const buyDate = new Date(data.buyDate);
    if (isNaN(buyDate.getTime())) {
      return errorResult('Invalid date', 'VALIDATION_ERROR');
    }

    if (buyDate > new Date()) {
      return errorResult('Buy date cannot be in the future', 'VALIDATION_ERROR');
    }

    await Portfolio.create({
      userId: session.user.id,
      symbol: data.symbol.toUpperCase(),
      company: data.company,
      quantity: data.quantity,
      buyPrice: data.buyPrice,
      buyDate,
      notes: data.notes?.trim() || undefined,
      addedAt: new Date(),
    });

    logger.info(`Added ${data.symbol} to portfolio for user ${session.user.id}`);
    return successResult(undefined, 'Added to portfolio');
  } catch (err) {
    logger.error('Failed to add to portfolio', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to add to portfolio', 'SERVER_ERROR');
  }
}

export async function updatePortfolioHolding(
  holdingId: string,
  data: Partial<AddPortfolioData>
): Promise<ActionResult<void>> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    const updateData: Record<string, unknown> = {};

    if (data.quantity !== undefined) {
      if (data.quantity <= 0) {
        return errorResult('Quantity must be greater than 0', 'VALIDATION_ERROR');
      }
      updateData.quantity = data.quantity;
    }

    if (data.buyPrice !== undefined) {
      if (data.buyPrice <= 0) {
        return errorResult('Buy price must be greater than 0', 'VALIDATION_ERROR');
      }
      updateData.buyPrice = data.buyPrice;
    }

    if (data.buyDate) {
      const buyDate = new Date(data.buyDate);
      if (isNaN(buyDate.getTime())) {
        return errorResult('Invalid date', 'VALIDATION_ERROR');
      }
      if (buyDate > new Date()) {
        return errorResult('Buy date cannot be in the future', 'VALIDATION_ERROR');
      }
      updateData.buyDate = buyDate;
    }

    if (data.notes !== undefined) {
      updateData.notes = data.notes.trim() || undefined;
    }

    const result = await Portfolio.updateOne(
      { _id: holdingId, userId: session.user.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return errorResult('Holding not found', 'NOT_FOUND');
    }

    logger.info(`Updated portfolio holding ${holdingId} for user ${session.user.id}`);
    return successResult(undefined, 'Holding updated');
  } catch (err) {
    logger.error('Failed to update portfolio holding', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to update holding', 'SERVER_ERROR');
  }
}

export async function removeFromPortfolio(holdingId: string): Promise<ActionResult<void>> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    const result = await Portfolio.deleteOne({
      _id: holdingId,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return errorResult('Holding not found', 'NOT_FOUND');
    }

    logger.info(`Removed holding ${holdingId} from portfolio for user ${session.user.id}`);
    return successResult(undefined, 'Removed from portfolio');
  } catch (err) {
    logger.error('Failed to remove from portfolio', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to remove from portfolio', 'SERVER_ERROR');
  }
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  holdings: number;
  topGainer?: { symbol: string; percent: number };
  topLoser?: { symbol: string; percent: number };
}

export async function getPortfolioSummary(
  holdings: PortfolioHoldingWithMetrics[]
): Promise<PortfolioSummary> {
  let totalValue = 0;
  let totalCost = 0;
  let topGainer: { symbol: string; percent: number } | undefined;
  let topLoser: { symbol: string; percent: number } | undefined;

  for (const holding of holdings) {
    const cost = holding.totalCost || 0;
    const value = holding.currentValue || 0;
    const percent = holding.profitLossPercent || 0;

    totalCost += cost;
    totalValue += value;

    if (!topGainer || percent > topGainer.percent) {
      topGainer = { symbol: holding.symbol, percent };
    }

    if (!topLoser || percent < topLoser.percent) {
      topLoser = { symbol: holding.symbol, percent };
    }
  }

  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalProfitLoss,
    totalProfitLossPercent,
    holdings: holdings.length,
    topGainer,
    topLoser,
  };
}
