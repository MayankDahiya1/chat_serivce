/*
 * CONST
 */
const GetMessage = asyncHandler(async (req, res) => {
  // Check if user exists
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

  // Extract conversation id from params
  const { conversationId } = req.params;

  // Fetch messages for conversation
  const _Messages = await DB.chatMessage.findMany({
    where: { conversationId, userId: req.userId },
    orderBy: { createdAt: 'asc' },
  });

  if (!_Messages) {
    return res.status(404).json({
      status: 'NOT_FOUND',
      message: 'No messages found for this conversation',
    });
  }

  res.json({
    messages: _Messages,
    status: 'SUCCESS',
    message: 'Fetched conversation messages',
  });
});

/*
 * EXPORTS
 */
export default GetMessage;
