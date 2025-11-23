// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import { logger } from '@/lib/logger';
import { withRateLimit } from '@/lib/middleware/rate-limit';

async function healthCheck() {
  try {
    // Check database connection
    await connectToDatabase();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'operational',
      },
    });
  } catch (err) {
    logger.error('Health check failed', err instanceof Error ? err : new Error(String(err)));
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Service degraded',
      },
      { status: 503 }
    );
  }
}

// Apply rate limiting (60 requests per minute)
export const GET = withRateLimit(healthCheck, {
  limit: 60,
});
