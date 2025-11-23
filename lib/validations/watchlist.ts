import { z } from 'zod';

// Watchlist Validation Schemas
export const symbolSchema = z
  .string()
  .min(1, 'Symbol is required')
  .max(10, 'Symbol is too long')
  .regex(/^[A-Z]+$/, 'Symbol must be uppercase letters only')
  .transform((val) => val.toUpperCase());

export const addToWatchlistSchema = z.object({
  symbol: symbolSchema,
  company: z.string().min(1, 'Company name is required').max(200, 'Company name is too long'),
});

export const removeFromWatchlistSchema = z.object({
  symbol: symbolSchema,
});

export const searchQuerySchema = z.string().max(100, 'Search query is too long').optional();

export type AddToWatchlistInput = z.infer<typeof addToWatchlistSchema>;
export type RemoveFromWatchlistInput = z.infer<typeof removeFromWatchlistSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
