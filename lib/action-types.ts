/**
 * Standard action result type for server actions
 * Provides consistent response format across the application
 */

export type ActionResult<T = void> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string };

/**
 * Helper to create success response
 */
export function successResult<T>(data: T, message?: string): ActionResult<T> {
  return { success: true, data, message };
}

/**
 * Helper to create error response
 */
export function errorResult(error: string, code?: string): ActionResult<never> {
  return { success: false, error, code };
}

/**
 * Helper to wrap async actions with error handling
 */
export async function withActionErrorHandling<T>(
  action: () => Promise<T>,
  errorMessage: string = 'An unexpected error occurred'
): Promise<ActionResult<T>> {
  try {
    const data = await action();
    return successResult(data);
  } catch (error) {
    // Log error for monitoring
    if (error instanceof Error) {
      console.error(`Action error: ${errorMessage}`, error);
    }
    
    // Return user-friendly error
    return errorResult(
      error instanceof Error ? error.message : errorMessage,
      error instanceof Error ? error.name : 'UNKNOWN_ERROR'
    );
  }
}
