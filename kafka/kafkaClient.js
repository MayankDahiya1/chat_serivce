/*
 * IMPORTS
 */
import { Kafka } from 'kafkajs';

/*
 * KAFKA CONFIGURATION
 */
const kafka = new Kafka({
  clientId: 'chat-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'chat-service-group' });

export async function initKafka() {
  try {
    await producer.connect();
    await consumer.connect();
    _KafkaLog('Kafka connection established successfully');
  } catch (error) {
    _ErrorLog('Kafka connection failed: %s', error.message);
    throw error;
  }
}

export async function shutdownKafka() {
  try {
    await producer.disconnect();
    await consumer.disconnect();
    _KafkaLog('Kafka connections closed successfully');
  } catch (error) {
    _ErrorLog('Kafka shutdown error: %s', error.message);
    throw error;
  }
}
