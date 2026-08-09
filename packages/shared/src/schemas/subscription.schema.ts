import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  name: z.string().min(1, 'Subscription name is required'),
  description: z.string().optional(),
  amount: z.number().positive('Amount must be greater than zero'),
  currency: z.string().default('USD'),
  billingCycle: z.enum(['weekly', 'monthly', 'yearly'], {
    errorMap: () => ({ message: 'Billing cycle must be weekly, monthly, or yearly' }),
  }),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format').optional(),
  isActive: z.boolean().default(true),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
