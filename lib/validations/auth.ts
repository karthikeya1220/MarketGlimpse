import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  country: z.string().min(1, 'Country is required'),
  investmentGoals: z.string().min(1, 'Investment goals required'),
  riskTolerance: z.string().min(1, 'Risk tolerance required'),
  preferredIndustry: z.string().min(1, 'Preferred industry required'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// lib/validations/watchlist.ts
export const symbolSchema = z
  .string()
  .min(1, 'Symbol is required')
  .max(10, 'Symbol too long')
  .regex(/^[A-Z]+$/, 'Symbol must be uppercase letters only');
