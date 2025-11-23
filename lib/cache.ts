// lib/cache.ts
import { LRUCache } from 'lru-cache';

type CacheOptions = {
  ttl?: number;
  max?: number;
};

class CacheManager {
  // Using any here as LRUCache requires it for flexible cache values
  // eslint-disable-next-line
  private cache: LRUCache<string, any>;

  constructor(options: CacheOptions = {}) {
    this.cache = new LRUCache({
      max: options.max || 500,
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key) as T | undefined;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, value, { ttl });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const stockCache = new CacheManager({ ttl: 5 * 60 * 1000 }); // 5 min
export const newsCache = new CacheManager({ ttl: 15 * 60 * 1000 }); // 15 min
export const profileCache = new CacheManager({ ttl: 60 * 60 * 1000 }); // 1 hour
