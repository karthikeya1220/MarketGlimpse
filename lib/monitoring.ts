// lib/monitoring.ts

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  // In production, also send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with analytics service (PostHog, Mixpanel, etc.)
    console.log('Track event:', eventName, properties);
  }
};

export const trackError = (error: Error, context?: Record<string, unknown>) => {
  // In development, also log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Track error:', error, context);
  }
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (_userId: string, _email?: string, _name?: string) => {
  // Implementation removed (was Sentry)
};

/**
 * Clear user context (e.g., on logout)
 */
export const clearUserContext = () => {
  // Implementation removed (was Sentry)
};

/**
 * Add custom context to error reports
 */
export const setCustomContext = (_name: string, _context: Record<string, unknown>) => {
  // Implementation removed (was Sentry)
};

/**
 * Add tags to error reports for better filtering
 */
export const setTag = (_key: string, _value: string) => {
  // Implementation removed (was Sentry)
};
