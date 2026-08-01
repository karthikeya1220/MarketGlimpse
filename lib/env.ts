// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_BASE_URL: z.string().url('Invalid base URL. Must be a valid URL'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'Better Auth secret must be at least 32 characters for security'),
  BETTER_AUTH_URL: z.string().url('Invalid Better Auth URL. Must be a valid URL'),
  MONGODB_URI: z
    .string()
    .min(1, 'MongoDB URI is required')
    .regex(
      /^mongodb(\+srv)?:\/\//,
      'Invalid MongoDB connection string. Must start with mongodb:// or mongodb+srv://'
    ),
  FINNHUB_API_KEY: z.string().min(1, 'Finnhub API key is required. Get one at https://finnhub.io/'),
  GEMINI_API_KEY: z
    .string()
    .min(1, 'Gemini API key is required. Get one at https://makersuite.google.com/app/apikey'),
  NODEMAILER_EMAIL: z.string().email('Invalid email address for Nodemailer'),
  NODEMAILER_PASSWORD: z
    .string()
    .min(1, 'Email password is required. Use Gmail app password from https://myaccount.google.com/apppasswords'),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    
    // Log successful validation in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Environment variables validated successfully');
    }
    
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('\n❌ Invalid environment variables:\n');
      const zodError = error as z.ZodError<typeof envSchema>;
      zodError.issues.forEach((err) => {
        console.error(`  ❌ ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n💡 Please check your .env file and compare with .env.example\n');
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment variable validation failed. Application cannot start.');
      } else {
        console.warn('\n⚠️  Continuing in development mode, but application may not work correctly.\n');
      }
    }
    throw error;
  }
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
