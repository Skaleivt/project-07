import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
// import path from 'node:path';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();

export const setupServer = () => {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // CORS configuration to allow credentials (cookies) from the Next.js frontend
  const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions)); // Using the configured CORS options

  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cookieParser());
  // app.use('/photo', express.static(path.resolve('src', 'uploads', 'photo')));
  app.use('/api-docs', swaggerDocs());
  app.use(router);
  // app.use('/api', router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
