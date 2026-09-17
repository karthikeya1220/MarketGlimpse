'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist, type WatchlistItem } from '@/database/models/watchlist.model';
import { logger } from '@/lib/logger';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { type ActionResult, successResult, errorResult } from '@/lib/action-types';
import { addToWatchlistSchema, removeFromWatchlistSchema, symbolSchema } from '@/lib/validations/watchlist';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db
      .collection('user')
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    logger.error('Failed to get watchlist symbols', err instanceof Error ? err : new Error(String(err)), { email });
    return [];
  }
}

export async function getUserWatchlist(): Promise<WatchlistItem[]> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return [];
    }

    const items = await Watchlist.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();
    
    return items.map((item) => ({
      ...item,
      _id: item._id.toString(),
    })) as unknown as WatchlistItem[];
  } catch (err) {
    logger.error('Failed to get user watchlist', err instanceof Error ? err : new Error(String(err)));
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string): Promise<ActionResult<void>> {
  try {
    const parsed = addToWatchlistSchema.safeParse({ symbol, company });
    if (!parsed.success) {
      return errorResult(parsed.error.issues.map((i) => i.message).join(', '), 'VALIDATION_ERROR');
    }
    const { symbol: validSymbol, company: validCompany } = parsed.data;

    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    const existing = await Watchlist.findOne({
      userId: session.user.id,
      symbol: validSymbol,
    });

    if (existing) {
      return errorResult('Stock already in watchlist', 'DUPLICATE_ERROR');
    }

    await Watchlist.create({
      userId: session.user.id,
      symbol: validSymbol,
      company: validCompany,
      addedAt: new Date(),
    });

    logger.info(`Added ${validSymbol} to watchlist for user ${session.user.id}`);
    return successResult(undefined, 'Added to watchlist');
  } catch (err) {
    logger.error('Failed to add to watchlist', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to add to watchlist', 'SERVER_ERROR');
  }
}

export async function removeFromWatchlist(symbol: string): Promise<ActionResult<void>> {
  try {
    const parsed = removeFromWatchlistSchema.safeParse({ symbol });
    if (!parsed.success) {
      return errorResult(parsed.error.issues.map((i) => i.message).join(', '), 'VALIDATION_ERROR');
    }
    const { symbol: validSymbol } = parsed.data;

    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    const result = await Watchlist.deleteOne({
      userId: session.user.id,
      symbol: validSymbol,
    });

    if (result.deletedCount === 0) {
      return errorResult('Stock not found in watchlist', 'NOT_FOUND');
    }

    logger.info(`Removed ${validSymbol} from watchlist for user ${session.user.id}`);
    return successResult(undefined, 'Removed from watchlist');
  } catch (err) {
    logger.error('Failed to remove from watchlist', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to remove from watchlist', 'SERVER_ERROR');
  }
}

export async function updateWatchlistNotes(symbol: string, notes: string): Promise<ActionResult<void>> {
  try {
    const parsed = symbolSchema.safeParse(symbol);
    if (!parsed.success) {
      return errorResult(parsed.error.issues.map((i) => i.message).join(', '), 'VALIDATION_ERROR');
    }
    const validSymbol = parsed.data;

    if (notes.length > 2000) {
      return errorResult('Notes too long (max 2000 characters)', 'VALIDATION_ERROR');
    }

    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    const result = await Watchlist.updateOne(
      {
        userId: session.user.id,
        symbol: validSymbol,
      },
      {
        $set: { notes: notes.trim() || undefined },
      }
    );

    if (result.matchedCount === 0) {
      return errorResult('Stock not found in watchlist', 'NOT_FOUND');
    }

    logger.info(`Updated notes for ${validSymbol} in watchlist for user ${session.user.id}`);
    return successResult(undefined, 'Notes updated');
  } catch (err) {
    logger.error('Failed to update watchlist notes', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to update notes', 'SERVER_ERROR');
  }
}

export async function updateWatchlistTags(symbol: string, tags: string[]): Promise<ActionResult<void>> {
  try {
    const parsed = symbolSchema.safeParse(symbol);
    if (!parsed.success) {
      return errorResult(parsed.error.issues.map((i) => i.message).join(', '), 'VALIDATION_ERROR');
    }
    const validSymbol = parsed.data;

    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return errorResult('Not authenticated', 'AUTH_ERROR');
    }

    // Validate and clean tags
    const cleanTags = tags
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0 && t.length <= 20)
      .slice(0, 10); // Max 10 tags

    const result = await Watchlist.updateOne(
      {
        userId: session.user.id,
        symbol: validSymbol,
      },
      {
        $set: { tags: cleanTags.length > 0 ? cleanTags : undefined },
      }
    );

    if (result.matchedCount === 0) {
      return errorResult('Stock not found in watchlist', 'NOT_FOUND');
    }

    logger.info(`Updated tags for ${validSymbol} in watchlist for user ${session.user.id}`);
    return successResult(undefined, 'Tags updated');
  } catch (err) {
    logger.error('Failed to update watchlist tags', err instanceof Error ? err : new Error(String(err)));
    return errorResult('Failed to update tags', 'SERVER_ERROR');
  }
}
