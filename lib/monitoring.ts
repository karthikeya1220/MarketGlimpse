// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  // Add breadcrumb to Sentry
  Sentry.addBreadcrumb({
    category: 'analytics',
    message: eventName,
    level: 'info',
    data: properties,
  });
  
  // In production, also send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with analytics service (PostHog, Mixpanel, etc.)
    console.log('Track event:', eventName, properties);
  }
};

export const trackError = (error: Error, context?: Record<string, unknown>) => {
  // Send to Sentry
  Sentry.captureException(error, {
    extra: context,
    level: 'error',
  });
  
  // In development, also log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Track error:', error, context);
  }
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (userId: string, email?: string, name?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username: name,
  });
};

/**
 * Clear user context (e.g., on logout)
 */
export const clearUserContext = () => {
  Sentry.setUser(null);
};

/**
 * Add custom context to error reports
 */
export const setCustomContext = (name: string, context: Record<string, unknown>) => {
  Sentry.setContext(name, context);
};

/**
 * Add tags to error reports for better filtering
 */
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

