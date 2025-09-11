/*
 * IMPORTS
 */
import { consumer } from '../kafkaClient.js';
import debug from 'debug';

/*
 * LOGS
 */
const log = debug('app:kafka:accountConsumer');

/*
 * EXPORTS
 */
export async function initAccountConsumer() {
  await consumer.subscribe({ topic: 'account-deleted', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        const { userId } = payload;

        log('Received account-deleted event:', payload);

        // Delete all chat conversation
        const _ConversationsDelete = await DB.chatConversation.deleteMany({
          where: { userId },
        });

        // If error persists
        if (_ConversationsDelete instanceof Error) {
          return _ConversationsDelete;
        }

        log(`Deleted ${conversations.length} conversations for user ${userId}`);
      } catch (err) {
        log('Error processing account-deleted event:', err);
      }
    },
  });

  log('Account Consumer running');
}
