/*
 * GET MESSAGES CONTROLLER
 */
const GetMessage = asyncHandler(async (req, res) => {
  // Auth check
  if (!req.user?.id) {
    _AuthLog('Unauthorized message retrieval attempt');
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Authentication required to retrieve messages',
    });
  }

  // Extract conversation id from params
  const { conversationId } = req.params;

  if (!conversationId) {
    return res.status(400).json({
      status: 'VALIDATION_ERROR',
      message: 'Conversation ID is required',
    });
  }

  _ChatLog('Retrieving messages for conversation: %s, user: %s', conversationId, req.user.id);

  // Fetch messages for conversation with ownership verification
  const _Messages = await DB.chatMessage.findMany({
    where: {
      conversationId,
      conversation: { userId: req.user.id },
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
      conversationId: true,
    },
  });

  if (!_Messages) {
    _ErrorLog('Failed to retrieve messages for conversation: %s', conversationId);
    return res.status(500).json({
      status: 'DATABASE_ERROR',
      message: 'Unable to retrieve messages. Please try again.',
    });
  }

  if (_Messages.length === 0) {
    _ChatLog('No messages found for conversation: %s', conversationId);
    return res.status(404).json({
      status: 'NOT_FOUND',
      message: 'No messages found for this conversation',
    });
  }

  _ChatLog('Retrieved %d messages for conversation: %s', _Messages.length, conversationId);

  res.json({
    messages: _Messages,
    status: 'SUCCESS',
    message: 'Messages retrieved successfully',
    count: _Messages.length,
  });
});

/*
 * EXPORTS
 */
export default GetMessage;
