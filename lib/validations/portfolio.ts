import { z } from 'zod';

const symbolSchema = z
  .string()
  .min(1, 'Symbol is required')
  .max(10, 'Symbol is too long')
  .regex(/^[A-Z]+$/, 'Symbol must be uppercase letters only')
  .transform((val) => val.toUpperCase());

export const addToPortfolioSchema = z.object({
  symbol: symbolSchema,
  company: z.string().min(1, 'Company name is required').max(200, 'Company name is too long'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  buyPrice: z.number().positive('Buy price must be greater than 0'),
  buyDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date <= new Date();
  }, 'Buy date must be a valid date in the past or present'),
  notes: z.string().max(2000, 'Notes too long').optional(),
});

export const updatePortfolioHoldingSchema = z.object({
  symbol: symbolSchema.optional(),
  company: z.string().min(1).max(200).optional(),
  quantity: z.number().positive().optional(),
  buyPrice: z.number().positive().optional(),
  buyDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date <= new Date();
  }, 'Buy date must be a valid date in the past or present').optional(),
  notes: z.string().max(2000).optional(),
});

export const holdingIdSchema = z.string().min(1, 'Holding ID is required');

export type AddToPortfolioInput = z.infer<typeof addToPortfolioSchema>;
export type UpdatePortfolioHoldingInput = z.infer<typeof updatePortfolioHoldingSchema>;
