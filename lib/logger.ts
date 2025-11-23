// lib/logger.ts
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
      // TODO: Send to logging service (DataDog, CloudWatch, etc.)
    }

    console[level === 'error' ? 'error' : 'log'](logEntry);
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
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
