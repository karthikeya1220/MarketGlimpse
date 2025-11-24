// Create a centralized error handler
// lib/errors.ts
import * as Sentry from '@sentry/nextjs';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class APIError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'API_ERROR', statusCode);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR', 500);
  }
}

// Centralized error logger
export const logError = (error: Error, context?: Record<string, unknown>) => {
  // Capture in Sentry with context
  Sentry.captureException(error, {
    extra: context,
    level: 'error',
  });
  
  // Also log to console for development
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};
