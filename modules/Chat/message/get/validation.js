/*
 * IMPORTS
 */
import { z } from 'zod';

/*
 * EXPORTS
 */
export const GetMessagesSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
});
