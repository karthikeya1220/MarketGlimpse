import { LRUCache } from 'lru-cache';

/**
 * Request deduplication to prevent redundant API calls
 * Caches in-flight requests and reuses them for duplicate calls
 */

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

class RequestDeduplicator {
  private pendingRequests: LRUCache<string, PendingRequest<unknown>>;

  constructor() {
    this.pendingRequests = new LRUCache<string, PendingRequest<unknown>>({
      max: 100,
      ttl: 30000, // 30 seconds
    });
  }

  /**
   * Deduplicates requests with the same key
   * If a request is already in flight, returns the existing promise
   * Otherwise, executes the request function and caches the promise
   */
  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // Check if there's already a pending request
    const pending = this.pendingRequests.get(key) as PendingRequest<T> | undefined;

    if (pending) {
      // Return the existing promise
      return pending.promise;
    }

    // Create new request
    const promise = requestFn()
      .then((result) => {
        // Remove from pending once complete
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((error) => {
        // Remove from pending on error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Store the pending request
    this.pendingRequests.set(key, {
      promise: promise as Promise<unknown>,
      timestamp: Date.now(),
    });

    return promise;
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.pendingRequests.clear();
  }

  /**
   * Get the number of pending requests
   */
  size(): number {
    return this.pendingRequests.size;
  }
}

// Singleton instance
export const requestDeduplicator = new RequestDeduplicator();

/**
 * Helper function to create a cache key from request parameters
 */
export function createRequestKey(endpoint: string, params?: Record<string, unknown>): string {
  if (!params) return endpoint;
  
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${JSON.stringify(params[key])}`)
    .join('&');
  
  return `${endpoint}?${sortedParams}`;
}
