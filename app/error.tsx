'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

/**
 * Next.js Error component - catches errors in route segments
 * This is automatically used by Next.js for error handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    logger.error('Route error occurred', error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
        <p className="text-gray-600">
          We encountered an unexpected error. Our team has been notified.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded-lg bg-gray-100 p-4 text-left">
            <summary className="cursor-pointer font-semibold">Error Details</summary>
            <pre className="mt-2 overflow-auto text-xs text-red-600">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
        <div className="flex gap-4 justify-center mt-6">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
