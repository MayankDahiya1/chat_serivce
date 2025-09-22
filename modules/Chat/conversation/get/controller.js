/*
 * GET CONVERSATIONS CONTROLLER
 */
const GetConversations = asyncHandler(async (req, res) => {
  // Auth check
  if (!req.user?.id) {
    _AuthLog('Unauthorized conversation retrieval attempt');
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Authentication required to retrieve conversations',
    });
  }

  _ChatLog('Retrieving conversations for user: %s', req.user.id);

  // Get Conversation with pagination support
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50); // Max 50 conversations
  const skip = (page - 1) * limit;

  const _Conversations = await DB.chatConversation.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: skip,
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { messages: true },
      },
    },
  });

  if (!_Conversations) {
    _ErrorLog('Failed to retrieve conversations for user: %s', req.user.id);
    return res.status(500).json({
      status: 'DATABASE_ERROR',
      message: 'Unable to retrieve conversations. Please try again.',
    });
  }

  _ChatLog('Retrieved %d conversations for user: %s', _Conversations.length, req.user.id);

  // Return
  res.json({
    conversations: _Conversations,
    status: 'SUCCESS',
    message: 'Conversations retrieved successfully',
    pagination: {
      page,
      limit,
      total: _Conversations.length,
    },
  });
});

/*
 * EXPORTS
 */
export default GetConversations;
