import { z } from 'zod';

export const createChannelSchema = z.object({
  name: z.string().min(1, 'Channel name is required'),
  type: z.string().min(1, 'Channel type is required'),
  config: z.any().optional(),
});

export type CreateChannelInput = z.infer<typeof createChannelSchema>;
