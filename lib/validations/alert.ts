import { z } from 'zod';

const symbolSchema = z
  .string()
  .min(1, 'Symbol is required')
  .max(10, 'Symbol is too long')
  .regex(/^[A-Z]+$/, 'Symbol must be uppercase letters only')
  .transform((val) => val.toUpperCase());

export const createAlertSchema = z.object({
  symbol: symbolSchema,
  company: z.string().min(1, 'Company name is required').max(200, 'Company name is too long'),
  targetPrice: z.number().positive('Target price must be greater than 0'),
  condition: z.enum(['above', 'below'], { message: 'Condition must be "above" or "below"' }),
});

export const alertIdSchema = z.string().min(1, 'Alert ID is required');

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
