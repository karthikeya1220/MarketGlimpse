// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url().default('http://localhost:3000'),
  BETTER_AUTH_SECRET: z.string().min(32).default('build-placeholder-min-32-characters-long-123'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
  MONGODB_URI: z.string().regex(/^mongodb(\+srv)?:\/\//).default('mongodb://localhost:27017/build-placeholder'),
  FINNHUB_API_KEY: z.string().min(1).default('build-placeholder'),
  GEMINI_API_KEY: z.string().min(1).default('build-placeholder'),
  NODEMAILER_EMAIL: z.string().email().default('build@example.com'),
  NODEMAILER_PASSWORD: z.string().min(1).default('build-placeholder'),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

function validateEnv(): Env {
  if (_env) return _env;

  try {
    _env = envSchema.parse(process.env);

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully');
    }

    return _env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('\n❌ Invalid environment variables:\n');
      const zodError = error as z.ZodError<typeof envSchema>;
      zodError.issues.forEach((err) => {
        console.error(`  ❌ ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n💡 Please check your .env file and compare with .env.example\n');
    }
    throw error;
  }
}

// Lazy proxy: validates on first property access, not at import time.
export const env = new Proxy({} as Env, {
  get(_target, prop) {
    const validated = validateEnv();
    return validated[prop as keyof Env];
  },
});
