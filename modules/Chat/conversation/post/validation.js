/*
 * IMPORTS
 */
import { z } from 'zod';

/*
 * EXPORTS
 */
export const StartConversationSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});
