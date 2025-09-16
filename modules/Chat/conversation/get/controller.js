/*
 * CONST
 */
const GetConversations = asyncHandler(async (req, res) => {
  // Check if user exsits
  if (!req.user.id) return res.status(401).json({ message: 'Unauthorized' });

  // Get Conversation
  const _Conversations = await DB.chatConversation.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  // If any error persists
  if (_Conversations instanceof Error) {
    throw new ApiError('Somthing went wrong while fetching conversation');
  }

  // Return
  res.json({ conversations: _Conversations, status: 'SUCCESS', message: 'Fetched conversations' });
});

/*
 * EXPORTS
 */
export default GetConversations;
