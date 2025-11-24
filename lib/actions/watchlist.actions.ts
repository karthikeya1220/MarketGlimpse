'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist, type WatchlistItem } from '@/database/models/watchlist.model';
import { logger } from '@/lib/logger';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

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

export async function addToWatchlist(symbol: string, company: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, message: 'Not authenticated' };
    }

    const existing = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (existing) {
      return { success: false, message: 'Stock already in watchlist' };
    }

    await Watchlist.create({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    logger.info(`Added ${symbol} to watchlist for user ${session.user.id}`);
    return { success: true, message: 'Added to watchlist' };
  } catch (err) {
    logger.error('Failed to add to watchlist', err instanceof Error ? err : new Error(String(err)));
    return { success: false, message: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(symbol: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, message: 'Not authenticated' };
    }

    const result = await Watchlist.deleteOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (result.deletedCount === 0) {
      return { success: false, message: 'Stock not found in watchlist' };
    }

    logger.info(`Removed ${symbol} from watchlist for user ${session.user.id}`);
    return { success: true, message: 'Removed from watchlist' };
  } catch (err) {
    logger.error('Failed to remove from watchlist', err instanceof Error ? err : new Error(String(err)));
    return { success: false, message: 'Failed to remove from watchlist' };
  }
}
