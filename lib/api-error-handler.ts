import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from '@/lib/logger';

/**
 * Standardized API error response structure
 */
export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
    timestamp: string;
  };
}

/**
 * Custom API error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handles errors in API routes and returns appropriate responses
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  // Log the error
  logger.error('API error occurred', error instanceof Error ? error : new Error(String(error)));

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 400 }
    );
  }

  // Handle custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          timestamp: new Date().toISOString(),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle standard errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: {
          message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
          code: 'INTERNAL_ERROR',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      },
    },
    { status: 500 }
  );
}

/**
 * Wraps an API handler with error handling
 */
export function withErrorHandler<T extends (...args: unknown[]) => Promise<NextResponse>>(
  handler: T
): (...args: Parameters<T>) => Promise<NextResponse> {
  return async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Common HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
