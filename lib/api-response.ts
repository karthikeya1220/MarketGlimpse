// lib/api-response.ts
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
};

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}

export function errorResponse(
  message: string,
  code?: string,
  details?: Record<string, unknown>
): ApiResponse {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}
