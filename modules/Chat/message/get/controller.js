/*
 * CONST
 */
const GetMessage = asyncHandler(async (req, res) => {
  // Check if user exsits
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });

  // Extrcting conversation id from payload
  const { conversationId } = req.params;

  // Get Conversation
  const _Messages = await DB.chatMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
  // If any error persists
  if (_Messages instanceof Error) {
    throw new ApiError('Somthing went wrong while fetching conversation');
  }

  // Return
  res.json({ messages: _Messages, status: 'SUCCESS', message: 'Fetched conversations' });
});

/*
 * EXPORTS
 */
export default GetMessage;
