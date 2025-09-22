/*
 * IMPORTS
 */
import { DeleteConversationSchema } from './validation.js';

/*
 * DELETE CONVERSATION CONTROLLER
 */
const DeleteConversation = asyncHandler(async (req, res) => {
  // Validate request
  const { conversationId } = DeleteConversationSchema.parse(req.body);

  _ChatLog('Deleting conversation: %s for user: %s', conversationId, req.user.id);

  // Auth check
  if (!req.user?.id) {
    _AuthLog('Unauthorized conversation deletion attempt');
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Authentication required to delete conversation',
    });
  }

  // Find conversation and verify ownership
  const _Conversation = await DB.chatConversation.findFirst({
    where: {
      id: conversationId,
      userId: req.user.id,
    },
  });

  // If conversation not found or not owned by user
  if (!_Conversation) {
    _ChatLog(
      'Conversation not found or unauthorized access: %s for user: %s',
      conversationId,
      req.user.id
    );
    return res.status(404).json({
      status: 'NOT_FOUND',
      message: 'Conversation not found or you do not have permission to delete it',
    });
  }

  // Delete conversation (cascade will delete messages)
  const _ConversationDelete = await DB.chatConversation.delete({
    where: {
      id: _Conversation.id,
    },
  });

  if (!_ConversationDelete) {
    _ErrorLog('Failed to delete conversation: %s', conversationId);
    return res.status(500).json({
      status: 'DATABASE_ERROR',
      message: 'Unable to delete conversation. Please try again.',
    });
  }

  _ChatLog('Successfully deleted conversation: %s for user: %s', conversationId, req.user.id);

  // Return response
  res.json({
    status: 'SUCCESS',
    message: 'Conversation deleted successfully',
  });
});

export default DeleteConversation;
