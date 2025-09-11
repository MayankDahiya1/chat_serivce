/*
 * IMPORTS
 */
import Groq from 'groq-sdk';

/*
 * INITIALISATION
 */
const groq = new Groq({ apiKey: process.env.LLM_API_KEY });

/*
 * LLM SERVICE
 */
export const generateResponse = async (conversationId, userId, userMessage) => {
  try {
    // Get current summary
    const conversation = await DB.chatConversation.findUnique({
      where: { id: conversationId },
      select: { summary: true },
    });

    // Prepare context: summary + latest user message
    const _MessagesForGroq = [
      {
        role: 'system',
        content: `This is the conversation so far (summary): ${
          conversation?.summary || 'No summary yet.'
        }`,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Call Groq for LLM response
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: _MessagesForGroq,
      temperature: 0.7,
    });

    const llmMessage = completion.choices[0]?.message?.content || 'LLM did not return a response';

    // Save LLM response as ASSISTANT message
    const _SavedMessage = await DB.chatMessage.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
        content: llmMessage,
        userId,
      },
    });

    if (_SavedMessage instanceof Error) {
      return new Error('SOMETHING_WENT_WRONG_IN_SAVING_MESSAGE');
    }

    /*
     *  CONVERSATION SUMMARY
     */
    const _SummaryPrompt = [
      {
        role: 'system',
        content:
          'You are a summarizer. Update the given summary with the latest user-assistant exchange in max 2 lines. Keep it concise.',
      },
      {
        role: 'user',
        content: `Previous Summary: ${conversation?.summary || 'No summary yet.'}`,
      },
      { role: 'user', content: `User said: ${userMessage}` },
      { role: 'assistant', content: `Assistant replied: ${llmMessage}` },
    ];

    const _SummaryCompletion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: _SummaryPrompt,
      temperature: 0.3,
    });

    // If error persists
    if (_SummaryCompletion instanceof Error) {
      return _SummaryCompletion;
    }

    // If empty
    if (_.isEmpty(_SummaryCompletion)) {
      return new Error('Something wrong during summary');
    }

    // New summary
    const _NewSummary =
      _SummaryCompletion.choices[0]?.message?.content || conversation?.summary || '';

    // Updating chat conversation
    const _ChatConversation = await DB.chatConversation.update({
      where: { id: conversationId },
      data: { summary: _NewSummary },
    });

    // If error persists
    if (_ChatConversation instanceof Error) {
      return _ChatConversation;
    }

    // If empty
    if (_.isEmpty(_ChatConversation)) {
      return new Error('Something went wrong during updating chat conversation');
    }

    return _SavedMessage;
  } catch (error) {
    console.error('LLMService Error:', error.message);
    throw new Error('Failed to generate LLM response');
  }
};
