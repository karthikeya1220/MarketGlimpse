import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Filter out unwanted errors
  beforeSend(event, hint) {
    const error = hint.originalException;
    
    // Ignore certain errors
    if (error && typeof error === 'object' && 'message' in error) {
      const message = String(error.message);
      
      // Ignore common browser extension errors
      if (message.includes('chrome-extension://') || message.includes('moz-extension://')) {
        return null;
      }
      
      // Ignore network errors that are expected
      if (message.includes('Failed to fetch') && message.includes('NetworkError')) {
        return null;
      }
    }
    
    return event;
  },
});
