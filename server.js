/*
 * IMPORTS
 */
import _App from './app.js';
import ENV from './config/env.js';
import { initKafka } from './kafka/kafkaClient.js';
import { initConsumers } from './kafka/consumers/index.js';

/*
 * SERVER STARTUP
 */
async function startServer() {
  try {
    // 1️⃣ Kafka connect
    await initKafka();
    console.log('Kafka connected');

    // 2️⃣ Start all consumers
    await initConsumers();
    console.log('Kafka consumers started');

    // 3️⃣ Start Express server
    _App.listen(ENV.PORT, () => {
      console.log(`Server running on http://localhost:${ENV.PORT}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
}

startServer();
