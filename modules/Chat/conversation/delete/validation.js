/*
 * IMPORTS
 */
import { z } from 'zod';
import { uuidSchema } from '../../../../utils/validation.js';

/*
 * VALIDATION SCHEMAS
 */
export const DeleteConversationSchema = z.object({
  conversationId: uuidSchema.refine(
    (id) => id.length > 0,
    'Conversation ID is required to delete the conversation'
  ),
});

/*
 * EXPORTS
 */
export default DeleteConversationSchema;
