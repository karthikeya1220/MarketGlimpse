// lib/logger.ts
import * as Sentry from '@sentry/nextjs';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level,
      message,
      timestamp,
      ...meta,
    };

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry for error level
      if (level === 'error') {
        const error = meta?.error as Error | undefined;
        if (error instanceof Error) {
          Sentry.captureException(error, {
            extra: { ...meta, message },
            level: 'error',
          });
        } else {
          Sentry.captureMessage(message, {
            extra: meta,
            level: 'error',
          });
        }
      }
      
      // TODO: Send to additional logging service (DataDog, CloudWatch, etc.) if needed
    }

    console[level === 'error' ? 'error' : 'log'](logEntry);
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
    
    // Send breadcrumb to Sentry
    Sentry.addBreadcrumb({
      message,
      level: 'info',
      data: meta,
    });
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
    
    // Send breadcrumb to Sentry
    Sentry.addBreadcrumb({
      message,
      level: 'warning',
      data: meta,
    });
    
    // Also capture warning in Sentry for visibility
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: meta,
      });
    }
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>) {
    this.log('error', message, {
      ...meta,
      error: error?.message,
      stack: error?.stack,
    });
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, meta);
    }
  }
}

export const logger = new Logger();

