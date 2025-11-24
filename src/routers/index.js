// src/routers/index.js
import { Router } from 'express';
import { usersRouter } from './users.js';
import { storiesRouter } from './stories.js';
import { authRouter } from './auth.js';

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/stories', storiesRouter);
router.use('/api/users', usersRouter);

export default router;
