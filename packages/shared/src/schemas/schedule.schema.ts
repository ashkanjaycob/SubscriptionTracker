import { z } from 'zod';

export const createScheduleSchema = z.object({
  subscriptionId: z.number().int('Invalid subscription ID'),
  channelId: z.number().int('Invalid channel ID'),
  reminderDate: z.string().datetime('Invalid reminder date format'),
  message: z.string().optional(),
});

export const updateScheduleSchema = createScheduleSchema.partial();

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
