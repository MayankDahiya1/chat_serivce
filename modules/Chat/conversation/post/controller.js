/*
 * IMPORTS
 */
import { StartConversationSchema } from './validation.js';
import { generateResponse } from '../../../../services/LLMService.js';

/*
 * START CONVERSATION CONTROLLER
 */
const StartConversation = async (req, res) => {
  try {
    // Validate request
    const { message } = StartConversationSchema.parse(req.body);

    // Auth check
    if (!req.userId)
      return res.status(401).json({ status: 'UNAUTHORIZED', message: 'User not authenticated' });

    // Create conversation
    const conversation = await DB.chatConversation.create({
      data: {
        userId: req.userId,
        title: message.slice(0, 50),
      },
    });

    // Save first user message
    const userMessage = await DB.chatMessage.create({
      data: {
        role: 'USER',
        content: message,
        conversationId: conversation.id,
        userId: req.userId,
      },
    });

    // Call LLM service to generate assistant response
    const assistantMessage = await generateResponse(conversation.id, req.userId, message);

    // Return response
    res.json({
      conversationId: conversation.id,
      title: conversation.title,
      userMessage: userMessage.content,
      assistantMessage: assistantMessage.content,
      status: 'SUCCESS',
      message: 'Conversation started successfully with LLM response',
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ status: 'INVALID_INPUT', message: err.errors });
    }
    throw new ApiError(err.message || 'Something went wrong during conversation start');
  }
};

export default StartConversation;
