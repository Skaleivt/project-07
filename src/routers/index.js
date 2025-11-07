import { Router } from 'express';

import { userRouter } from './users.js';
import { authRouter } from './auth.js';

const router = Router();
router.use('/api/auth', authRouter);
router.use('/api/users', userRouter);
// router.use('/api/stories');

export default router;
