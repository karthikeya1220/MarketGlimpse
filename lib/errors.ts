// Create a centralized error handler
// lib/errors.ts
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
  // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};
