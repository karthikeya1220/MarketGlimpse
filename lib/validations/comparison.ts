import { z } from 'zod';

export const comparisonSymbolsSchema = z
  .array(
    z
      .string()
      .min(1)
      .max(10)
      .regex(/^[A-Z]+$/, 'Symbol must be uppercase letters only')
      .transform((val) => val.toUpperCase())
  )
  .min(1, 'At least one symbol is required')
  .max(5, 'Maximum 5 symbols for comparison');

export type ComparisonSymbolsInput = z.infer<typeof comparisonSymbolsSchema>;
