import { createApp } from './app';
import { config } from './config/env';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Financial Advisor Chat API                                ║
╚════════════════════════════════════════════════════════════╝

  🚀 Server running on port ${config.port}
  📡 Environment: ${config.nodeEnv}
  🏥 Health check: http://localhost:${config.port}/health

  Endpoints:
  POST   /chat/messages                 - Send a message
  GET    /chat/conversations            - List conversations
  GET    /chat/conversations/:id/messages - Get messages
  POST   /chat/conversations/:id/rename - Rename conversation
  DELETE /chat/conversations/:id        - Delete conversation

  Press Ctrl+C to stop
`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to exit the process or send to error tracking service
});

export default app;
