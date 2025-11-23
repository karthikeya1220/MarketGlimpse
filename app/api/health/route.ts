// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';

export async function GET() {
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
    console.error('Health check failed:', err);
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
