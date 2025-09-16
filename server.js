/*
 * IMPORTS
 */
import http from 'http';
import { Server } from 'socket.io';
import _App from './app.js';
import ENV from './config/env.js';
import { initKafka } from './kafka/kafkaClient.js';
import { initConsumers } from './kafka/consumers/index.js';

/*
 * HTTP + SOCKET.IO INIT
 */
const httpServer = http.createServer(_App);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // ⚠️ change to your frontend URL in prod
    methods: ['GET', 'POST'],
  },
});

/*
 * Attach io globally so controllers can use it
 */
global._io = io;

/*
 * SERVER STARTUP
 */
async function startServer() {
  try {
    await initKafka();
    console.log('Kafka connected');

    await initConsumers();
    console.log('Kafka consumers started');

    httpServer.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
    });

    io.on('connection', (socket) => {
      console.log('⚡ Client connected:', socket.id);

      socket.on('join', (userId) => {
        console.log(`📌 User ${userId} joined`);
        socket.join(userId); // join personal room
      });

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
}

startServer();
