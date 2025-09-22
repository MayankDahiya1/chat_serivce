/*
 * IMPORTS
 */
import { z } from 'zod';
import { messageSchema } from '../../../../utils/validation.js';

/*
 * VALIDATION SCHEMAS
 */
export const StartConversationSchema = z.object({
  message: messageSchema
    .refine((msg) => msg.length >= 1, 'Please provide a message to start the conversation')
    .refine(
      (msg) => msg.length <= 4000,
      'Message is too long. Please keep it under 4000 characters'
    ),
});

/*
 * EXPORTS
 */
export default StartConversationSchema;
