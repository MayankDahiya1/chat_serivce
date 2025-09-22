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
    origin: '*',
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
    _ServerLog('Kafka connection established successfully');

    await initConsumers();
    _ServerLog('Kafka consumers initialized and started');

    httpServer.listen(ENV.PORT, () => {
      _ServerLog(`Server running on http://localhost:${ENV.PORT}`);
    });

    io.on('connection', (socket) => {
      _ServerLog('Client connected: %s', socket.id);

      socket.on('join', (userId) => {
        _ServerLog('User %s joined', userId);
        socket.join(userId);
      });

      socket.on('disconnect', () => {
        _ServerLog('Client disconnected: %s', socket.id);
      });
    });
  } catch (err) {
    _ErrorLog('Server startup failed: %s', err.message);
    _ErrorLog('Stack trace: %s', err.stack);
    process.exit(1);
  }
}

startServer();
