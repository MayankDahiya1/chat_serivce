/*
 * IMPORTS
 */
import { z } from 'zod';

/*
 * EXPORTS
 */
export const DeleteonversationSchema = z.object({
  conversationId: z.string().min(1, 'Message is required'),
});
