'use server';

import { connectToDatabase } from '@/database/mongoose';
import { logger } from '@/lib/logger';

/**
 * Returns all users with email/name for news email dispatch.
 * INTERNAL ONLY — called from Inngest server-side functions.
 * Must NOT be callable from client-side code.
 */
export const getAllUsersForNewsEmail = async () => {
  // Guard: reject if this somehow runs on the client
  if (typeof window !== 'undefined') {
    throw new Error('getAllUsersForNewsEmail is server-only');
  }

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('Mongoose connection not connected');

    const users = await db
      .collection('user')
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
      )
      .toArray();

    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        id: user.id || user._id?.toString() || '',
        email: user.email,
        name: user.name,
      }));
  } catch (e) {
    logger.error('Failed to fetch users for news email', e instanceof Error ? e : new Error(String(e)));
    return [];
  }
};
