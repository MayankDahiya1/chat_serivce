/*
 * IMPORTS
 */
import { z } from 'zod';

/*
 * EXPORTS
 */
export const SendMessageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  message: z.string().min(1, 'Message is required'),
});
