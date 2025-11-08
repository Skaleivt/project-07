// src/routers/index.js
import { Router } from 'express';
import usersRouter from './users.js';

const router = Router();

// підключаємо підгрупу роутів
router.use('/api/users', usersRouter);

// router.use('/api/stories');
// router.use('/api/auth');

export default router;


