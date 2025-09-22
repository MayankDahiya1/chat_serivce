/*
 * IMPORTS
 */
import { StartConversationSchema } from './validation.js';
import { generateResponse } from '../../../../services/LLMService.js';
import { producer } from '../../../../kafka/kafkaClient.js';

/*
 * START CONVERSATION CONTROLLER
 */
const StartConversation = async (req, res) => {
  try {
    // Validate request
    const { message } = StartConversationSchema.parse(req.body);

    // Auth check
    if (!req.user) {
      _AuthLog('Unauthorized conversation start attempt');
      return res.status(401).json({
        status: 'UNAUTHORIZED',
        message: 'Authentication required to start conversation',
      });
    }

    _ChatLog('Starting new conversation for user: %s', req.user.id);

    // Create conversation
    const conversation = await DB.chatConversation.create({
      data: {
        userId: req.user.id,
        title: message.slice(0, 50),
      },
    });

    // If error in creating conversation
    if (!conversation) {
      _ErrorLog('Failed to create conversation for user: %s', req.user.id);
      return res.status(500).json({
        status: 'DATABASE_ERROR',
        message: 'Unable to create conversation. Please try again.',
      });
    }

    _ChatLog('Created conversation: %s for user: %s', conversation.id, req.user.id);

    // Save first user message
    const userMessage = await DB.chatMessage.create({
      data: {
        role: 'USER',
        content: message,
        conversationId: conversation.id,
      },
    });

    // If error in saving user message, rollback conversation creation
    if (!userMessage) {
      _ErrorLog('Failed to save user message, rolling back conversation: %s', conversation.id);
      await DB.chatConversation.delete({ where: { id: conversation.id } });
      return res.status(500).json({
        status: 'DATABASE_ERROR',
        message: 'Unable to save message. Please try again.',
      });
    }

    _ChatLog('Saved user message for conversation: %s', conversation.id);

    // Call LLM service to generate assistant response
    const assistantMessage = await generateResponse(conversation.id, req.user.id, message);

    // Send Kafka event
    try {
      await producer.send({
        topic: 'conversation-created',
        messages: [
          {
            key: req.user.id.toString(),
            value: JSON.stringify({
              conversationId: conversation.id,
              title: conversation.title,
              userId: req.user.id,
              createdAt: conversation.createdAt,
            }),
          },
        ],
      });

      _KafkaLog('Sent conversation-created event for conversation: %s', conversation.id);
    } catch (kafkaError) {
      _ErrorLog('Failed to send Kafka event: %s', kafkaError.message);
      // Don't fail the request for Kafka errors
    }

    _ChatLog('Successfully started conversation: %s for user: %s', conversation.id, req.user.id);

    // Return response
    res.json({
      conversationId: conversation.id,
      title: conversation.title,
      userMessage: userMessage.content,
      assistantMessage: assistantMessage.content,
      status: 'SUCCESS',
      message: 'Conversation started successfully with AI response',
    });
  } catch (err) {
    _ErrorLog('Error in StartConversation: %s', err.message);

    if (err.name === 'ZodError') {
      return res.status(400).json({
        status: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        errors: err.errors,
      });
    }

    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        status: 'ERROR',
        message: err.message,
      });
    }

    return res.status(500).json({
      status: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while starting the conversation',
    });
  }
};

export default StartConversation;
