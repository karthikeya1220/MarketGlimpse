// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url('Invalid base URL'),
  BETTER_AUTH_SECRET: z.string().min(32, 'Better Auth secret must be at least 32 characters'),
  BETTER_AUTH_URL: z.string().url('Invalid Better Auth URL'),
  MONGODB_URI: z
    .string()
    .min(1, 'MongoDB URI is required')
    .regex(/^mongodb(\+srv)?:\/\//, 'Invalid MongoDB connection string'),
  FINNHUB_API_KEY: z.string().min(1, 'Finnhub API key is required'),
  GEMINI_API_KEY: z.string().min(1, 'Gemini API key is required'),
  NODEMAILER_EMAIL: z.string().email('Invalid email address'),
  NODEMAILER_PASSWORD: z.string().min(1, 'Email password is required'),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      const zodError = error as z.ZodError<typeof envSchema>;
      zodError.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Environment variable validation failed');
    }
    throw error;
  }
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
