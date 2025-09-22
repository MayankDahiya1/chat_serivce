/*
 * IMPORTS
 */
import { SendMessageSchema } from './validation.js';
import { generateResponse } from '../../../../services/LLMService.js';

/*
 * SEND MESSAGE CONTROLLER
 */
const SendMessage = asyncHandler(async (req, res) => {
  // Validate request body
  const { conversationId, message } = SendMessageSchema.parse(req.body);

  // Auth check
  if (!req.user?.id) {
    _AuthLog('Unauthorized message send attempt');
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Authentication required to send messages',
    });
  }

  _ChatLog('Sending message to conversation: %s for user: %s', conversationId, req.user.id);

  // Verify conversation ownership before allowing message
  const conversationExists = await DB.chatConversation.findFirst({
    where: {
      id: conversationId,
      userId: req.user.id,
    },
  });

  if (!conversationExists) {
    _ChatLog(
      'Conversation not found or unauthorized: %s for user: %s',
      conversationId,
      req.user.id
    );
    return res.status(404).json({
      status: 'NOT_FOUND',
      message: 'Conversation not found or you do not have permission to send messages',
    });
  }

  // Save user's message
  const _UserMessage = await DB.chatMessage.create({
    data: {
      role: 'USER',
      content: message,
      conversationId,
    },
  });

  // If error persisting user message
  if (!_UserMessage) {
    _ErrorLog('Failed to save user message for conversation: %s', conversationId);
    return res.status(500).json({
      status: 'DATABASE_ERROR',
      message: 'Unable to save message. Please try again.',
    });
  }

  _ChatLog('Saved user message for conversation: %s', conversationId);

  // Calling LLM service to generate assistant response
  const _AssistantMessage = await generateResponse(conversationId, req.user.id, message);

  _ChatLog('Generated assistant response for conversation: %s', conversationId);

  // Return response
  res.json({
    role: 'ASSISTANT',
    content: _AssistantMessage.content,
    createdAt: _AssistantMessage.createdAt,
    status: 'SUCCESS',
    message: 'Message sent successfully with AI response',
  });
});

export default SendMessage;
