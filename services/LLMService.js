/*
 * IMPORTS
 */
import Groq from 'groq-sdk';
import _ from 'underscore';

/*
 * INITIALIZATION
 */
const groq = new Groq({ apiKey: process.env.LLM_API_KEY });

/*
 * LLM SERVICE
 */
export const generateResponse = async (conversationId, userId, userMessage) => {
  try {
    // Input validation
    if (!conversationId || !userId || !userMessage?.trim()) {
      throw new ApiError(
        'Missing required parameters: conversationId, userId, or userMessage',
        400
      );
    }

    if (userMessage.length > 4000) {
      throw new ApiError('Message too long. Maximum 4000 characters allowed.', 400);
    }

    _LLMLog('Generating response for conversation: %s, user: %s', conversationId, userId);

    // Get current summary (history so far)
    const conversation = await DB.chatConversation.findUnique({
      where: { id: conversationId },
      select: { summary: true },
    });

    if (!conversation) {
      throw new ApiError('Conversation not found', 404);
    }

    _LLMLog('Retrieved conversation summary for conversation: %s', conversationId);

    /*
     * FEW-SHOT EXAMPLES FOR STYLE TRAINING
     */
    const _MessagesForGroq = [
      {
        role: 'system',
        content: `You are a friendly human-like assistant.
        - Always reply in a short, natural, conversational style (2–3 sentences).
        - Avoid long lists or lectures unless explicitly asked.
        - Use simple words, like talking to a friend.
        This is the conversation so far (summary): ${conversation?.summary || 'No summary yet.'}`,
      },
      // Few-shot examples
      {
        role: 'user',
        content: 'What do I do?',
      },
      {
        role: 'assistant',
        content: "You're an IT student, so you're mostly learning coding and tech stuff.",
      },
      {
        role: 'user',
        content: "What's my name?",
      },
      {
        role: 'assistant',
        content: 'Your name is Mayank.',
      },
      // Actual user message
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Call Groq for LLM response
    _LLMLog('Calling Groq API for response generation');
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: _MessagesForGroq,
      temperature: 0.65,
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new ApiError('LLM service did not return a valid response', 502);
    }

    let llmMessage = completion.choices[0].message.content;

    // Safeguard: force short replies
    const sentences = llmMessage.split(/(?<=[.!?])\s+/); // split by sentences
    if (sentences.length > 3) {
      llmMessage = sentences.slice(0, 2).join(' ') + '...';
      _LLMLog('Long reply trimmed to maintain brevity');
    }

    _LLMLog('Generated LLM response successfully');

    // Save LLM response as ASSISTANT message
    const _SavedMessage = await DB.chatMessage.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
        content: llmMessage,
      },
    });

    if (!_SavedMessage) {
      throw new ApiError('Failed to save assistant message to database', 500);
    }

    _LLMLog('Saved assistant message to database');

    /*
     *  CONVERSATION SUMMARY (LOGBOOK STYLE)
     */
    let _NewSummary =
      `${conversation?.summary || ''}\nUser: ${userMessage}\nAssistant: ${llmMessage}`.trim();

    // Optional: compress if too long
    if (_NewSummary.length > 2000) {
      _LLMLog('Compressing conversation summary due to length');

      const _SummaryPrompt = [
        {
          role: 'system',
          content: `You are a summarizer. 
          Compress this chat history into a shorter but faithful version. 
          Do NOT add new information. 
          Keep ALL user and assistant turns intact, just shorten wording if needed.`,
        },
        { role: 'user', content: _NewSummary },
      ];

      try {
        const _SummaryCompletion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: _SummaryPrompt,
          temperature: 0,
        });

        _NewSummary =
          _SummaryCompletion.choices?.[0]?.message?.content ||
          _SummaryCompletion.choices?.[0]?.text ||
          _NewSummary;

        _LLMLog('Summary compression completed');
      } catch (summaryError) {
        _LLMLog('Summary compression failed, using original: %s', summaryError.message);
      }
    }

    // Update chat conversation
    const _ChatConversation = await DB.chatConversation.update({
      where: { id: conversationId },
      data: { summary: _NewSummary },
    });

    if (!_ChatConversation) {
      throw new ApiError('Failed to update conversation summary', 500);
    }

    _LLMLog('Updated conversation summary successfully');
    return _SavedMessage;
  } catch (error) {
    _ErrorLog('LLM Service error: %s', error.message);

    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
      throw new ApiError('LLM service temporarily unavailable. Please try again later.', 503);
    }

    if (error.code === 'ENOTFOUND') {
      throw new ApiError('LLM service connection failed. Please check your network.', 503);
    }

    if (error.name === 'TimeoutError') {
      throw new ApiError('LLM service request timed out. Please try again.', 504);
    }

    if (error.status >= 400 && error.status < 500) {
      throw new ApiError('Invalid request to LLM service', 400);
    }

    if (error.status >= 500) {
      throw new ApiError('LLM service internal error. Please try again later.', 502);
    }

    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Failed to generate LLM response. Please try again.', 500);
  }
};
