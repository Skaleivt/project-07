// src/server.js
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
  const APP = process.env.APP_DOMAIN;

  const allowedOrigins = [
    APP,
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );
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
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
