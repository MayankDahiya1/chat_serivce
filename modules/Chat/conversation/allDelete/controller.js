/*
 * DELETE ALL CONVERSATION CONTROLLER
 */
const DeleteAllConversation = async (req, res) => {
  try {
    // Auth check
    if (!req.userId)
      return res.status(401).json({ status: 'UNAUTHORIZED', message: 'User not authenticated' });

    // Delete all conversation
    const _ConversationDelteAll = await DB.chatConversation.deleteMany({
      data: {
        userId: req.userId,
      },
    });

    // If error persists
    if (_ConversationDelteAll instanceof Error) {
      return _ConversationDelteAll;
    }

    // Return response
    res.json({
      status: 'SUCCESSFULLY_DELTED',
      message: 'All Conversation successfully delted',
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ status: 'INVALID_INPUT', message: err.errors });
    }
    throw new ApiError(err.message || 'Something went wrong during conversation start');
  }
};

export default DeleteAllConversation;
