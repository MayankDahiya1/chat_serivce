/*
 * IMPORTS
 */
import { Kafka } from 'kafkajs';
import debug from 'debug';

/*
 * LOGGER
 */
const _Log = debug('app:kafka');

const kafka = new Kafka({
  clientId: 'app-service',
  brokers: [process.env.KAFKA_BROKER || '127.0.0.1:9092'],
});

/*
 * EXPORTS
 */
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'app-service-group' });

export async function initKafka() {
  await producer.connect();
  await consumer.connect();
  _Log('Kafka connected');
}

export async function shutdownKafka() {
  await producer.disconnect();
  await consumer.disconnect();
  _Log('Kafka disconnected');
}
