/**
 * Instrumentation file for Next.js
 * This is called once when the server starts
 * Perfect for initializing monitoring tools like Sentry
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import Sentry config
    await import('./sentry.server.config');
  }

  // Only run on edge runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Import Sentry config
    await import('./sentry.edge.config');
  }
}
