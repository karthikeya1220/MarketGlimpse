// lib/monitoring.ts
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  // TODO: Integrate with analytics service (PostHog, Mixpanel, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics
    console.log('Track event:', eventName, properties);
  }
};

export const trackError = (error: Error, context?: Record<string, unknown>) => {
  // TODO: Integrate with error tracking (Sentry)
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking
    console.error('Track error:', error, context);
  }
};
