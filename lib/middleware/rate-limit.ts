import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

/**
 * Rate limiting middleware for API routes
 * Usage: Wrap your API route handler with this middleware
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options: {
    limit?: number;
    window?: number;
    keyGenerator?: (req: NextRequest) => string;
  } = {}
) {
  const { limit = 10, keyGenerator = defaultKeyGenerator } = options;

  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const identifier = keyGenerator(req);
      const rateLimit = checkRateLimit(identifier, limit);

      // Add rate limit headers
      const headers = new Headers();
      headers.set('X-RateLimit-Limit', limit.toString());
      headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());

      if (!rateLimit.success) {
        logger.warn('Rate limit exceeded', { identifier, limit });
        
        return NextResponse.json(
          {
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
          },
          {
            status: 429,
            headers,
          }
        );
      }

      const response = await handler(req);
      
      // Add rate limit headers to successful responses
      if (rateLimit.remaining !== undefined) {
        response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
      }
      response.headers.set('X-RateLimit-Limit', limit.toString());

      return response;
    } catch (error) {
      logger.error('Rate limit middleware error', error instanceof Error ? error : new Error(String(error)));
      // Continue to handler even if rate limiting fails
      return handler(req);
    }
  };
}

/**
 * Default key generator uses IP address or user ID from request
 */
function defaultKeyGenerator(req: NextRequest): string {
  // Try to get user ID from session/cookie
  const userId = req.cookies.get('user_id')?.value;
  if (userId) return `user:${userId}`;

  // Fall back to IP address
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  
  return `ip:${ip}`;
}

/**
 * Create a rate limit key generator based on API route
 */
export function createRouteKeyGenerator(route: string) {
  return (req: NextRequest): string => {
    const baseKey = defaultKeyGenerator(req);
    return `${baseKey}:${route}`;
  };
}
