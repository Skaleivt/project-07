import { Router } from 'express';
import authRouter from './auth.js';

const router = Router();

// router.use('/api/users');
// router.use('/api/stories');
router.use('/api/auth', authRouter);

export default router;
