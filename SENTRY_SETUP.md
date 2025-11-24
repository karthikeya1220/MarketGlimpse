# Sentry Setup Guide

## Overview
Sentry is integrated for comprehensive error tracking, performance monitoring, and session replay.

## Configuration

### 1. Create a Sentry Account
1. Go to [sentry.io](https://sentry.io)
2. Sign up or log in
3. Create a new project (select Next.js)

### 2. Get Your DSN
After creating a project, you'll receive a DSN (Data Source Name). It looks like:
```
https://[key]@[organization].ingest.sentry.io/[project-id]
```

### 3. Add Environment Variables
Add the following to your `.env` file:

```bash
# Sentry Configuration (Optional - only needed for error tracking)
SENTRY_DSN=https://your-sentry-dsn-here
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn-here
```

**Note**: Both variables should have the same value. The `NEXT_PUBLIC_` prefix makes it available on the client side.

### 4. Testing Sentry Integration

You can test if Sentry is working by triggering an error:

```typescript
import * as Sentry from '@sentry/nextjs';

// Trigger a test error
Sentry.captureException(new Error('This is a test error'));
```

## Features Enabled

### ✅ Error Tracking
- Automatic capture of unhandled errors
- Custom error reporting via `logger.error()`
- Stack traces with source maps
- Breadcrumbs for debugging context

### ✅ Performance Monitoring
- Tracks page load times
- API request durations
- Database query performance
- Sample rate: 10% in production, 100% in development

### ✅ Session Replay (Client-side only)
- Records user sessions when errors occur
- Masks sensitive data automatically
- 10% sample rate for normal sessions
- 100% sample rate when errors occur

### ✅ User Context
- Automatically captures user information when logged in
- Can be set manually via `setUserContext()`

## Usage Examples

### Logging Errors
```typescript
import { logger } from '@/lib/logger';

try {
  // Your code
} catch (error) {
  logger.error('Something went wrong', error as Error, {
    userId: user.id,
    action: 'fetch_data',
  });
}
```

### Tracking Custom Events
```typescript
import { trackEvent } from '@/lib/monitoring';

trackEvent('user_action', {
  action: 'watchlist_add',
  symbol: 'AAPL',
});
```

### Setting User Context
```typescript
import { setUserContext } from '@/lib/monitoring';

// On login
setUserContext(user.id, user.email, user.name);

// On logout
import { clearUserContext } from '@/lib/monitoring';
clearUserContext();
```

### Custom Context
```typescript
import { setCustomContext, setTag } from '@/lib/monitoring';

setCustomContext('api_call', {
  endpoint: '/api/stocks',
  method: 'GET',
});

setTag('environment', 'production');
```

## Filtering Errors

The following errors are automatically filtered out:
- Browser extension errors
- Expected network errors
- Client-side fetch failures

You can customize this in `sentry.client.config.ts` and `sentry.server.config.ts`.

## Production Considerations

### Environment-Specific Behavior

**Development:**
- Debug mode enabled
- All errors logged to console
- 100% trace sampling

**Production:**
- Debug mode disabled
- Errors sent to Sentry
- 10% trace sampling (configurable)
- Sensitive headers removed (authorization, cookie)

### Performance Impact
- Minimal overhead (~1-2ms per request)
- Async error reporting doesn't block requests
- Session replay only captures on errors by default

## Troubleshooting

### Errors Not Appearing in Sentry
1. Check if `SENTRY_DSN` is set correctly
2. Verify the DSN is valid
3. Check network tab for Sentry requests
4. Look for console errors from Sentry

### Too Many Errors
Adjust the `beforeSend` filter in the Sentry config files to ignore more error types.

### High Performance Impact
Reduce the `tracesSampleRate` in the config files (currently 10% in production).

## Resources
- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Dashboard](https://sentry.io) - View errors and performance data
- [Releases](https://docs.sentry.io/product/releases/) - Track deployments
