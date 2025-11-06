import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
  try {
    await initMongoConnection(); // підключення до MongoDB
    setupServer(); // запускаємо сервер
  } catch (err) {
    console.error('Failed to start server', err);
  }
};

bootstrap();
