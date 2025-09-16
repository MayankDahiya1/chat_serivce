/*
 * IMPORTS
 */
import { DeleteonversationSchema } from './validation.js';

/*
 * DELETE CONVERSATION CONTROLLER
 */
const DeleteConversation = async (req, res) => {
  try {
    // Validate request
    const { conversationId } = DeleteonversationSchema.parse(req.body);

    // Auth check
    if (!req.userId)
      return res.status(401).json({ status: 'UNAUTHORIZED', message: 'User not authenticated' });

    // Create conversation
    const _Conversation = await DB.chatConversation.findUnique({
      data: {
        id: conversationId,
        userId: req.userId,
      },
    });

    // If error persists
    if (_Conversation instanceof Error) {
      return _Conversation;
    }

    // If empty
    if (!_Conversation) {
      return new Error('Conversation not found.');
    }

    // Create conversation
    const _ConversationDelete = await DB.chatConversation.delete({
      data: {
        id: _Conversation.id,
      },
    });

    // If error persists
    if (_ConversationDelete instanceof Error) {
      return _ConversationDelete;
    }

    // If empty
    if (!_ConversationDelete) {
      return new Error('Conversation not delete somthing went wrong.');
    }

    // Return response
    res.json({
      status: 'SUCCESSFULLY_DELETED',
      message: 'Conversation deleted successfully.',
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ status: 'INVALID_INPUT', message: err.errors });
    }
    throw new ApiError(err.message || 'Something went wrong during conversation start');
  }
};

export default DeleteConversation;
