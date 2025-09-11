/*
 * IMPORTS
 */
import { SendMessageSchema } from './validation.js';
import { generateResponse } from '../../../../services/LLMService.js';

/*
 * SEND MESSAGE CONTROLLER
 */
const SendMessage = async (req, res) => {
  try {
    // Validate request body
    const { conversationId, message } = SendMessageSchema.parse(req.body);

    // Auth check
    if (!req.userId)
      return res.status(401).json({ status: 'UNAUTHORIZED', message: 'User not authenticated' });

    // Save user's message
    const _UserMessage = await DB.chatMessage.create({
      data: {
        role: 'USER',
        content: message,
        conversationId,
        userId: req.userId,
      },
    });

    // Calling LLM service to generate assistant response
    const _AssistantMessage = await generateResponse(conversationId, req.userId, message);

    // Return response
    res.json({
      conversationId,
      userMessage: _UserMessage.content,
      assistantMessage: _AssistantMessage.content,
      status: 'SUCCESS',
      message: 'Message sent successfully with LLM response',
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ status: 'INVALID_INPUT', message: err.errors });
    }
    throw new ApiError(err.message || 'Something went wrong while sending message');
  }
};

export default SendMessage;
