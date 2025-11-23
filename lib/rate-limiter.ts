// lib/rate-limiter.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache<string, number>({
  max: 500,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(identifier: string, limit: number = 10) {
  const current = rateLimit.get(identifier) || 0;

  if (current >= limit) {
    return { success: false, remaining: 0 };
  }

  rateLimit.set(identifier, current + 1);
  return { success: true, remaining: limit - current - 1 };
}
