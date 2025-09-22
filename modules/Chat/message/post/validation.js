/*
 * IMPORTS
 */
import { z } from 'zod';
import { messageSchema, uuidSchema } from '../../../../utils/validation.js';

/*
 * VALIDATION SCHEMAS
 */
export const SendMessageSchema = z.object({
  conversationId: uuidSchema.refine((id) => id.length > 0, 'Conversation ID is required'),
  message: messageSchema
    .refine((msg) => msg.length >= 1, 'Please provide a message to send')
    .refine(
      (msg) => msg.length <= 4000,
      'Message is too long. Please keep it under 4000 characters'
    ),
});

/*
 * EXPORTS
 */
export default SendMessageSchema;
