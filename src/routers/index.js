import { Router } from 'express';
import storiesRouter from './stories.js';
import { userRouter } from './users.js';
import { authRouter } from './auth.js';

const router = Router();
router.use('/api/auth', authRouter);
router.use('/api/users', userRouter);
router.use('/api/stories', storiesRouter);

// router.use('/auth', authRouter);      // -> /api/auth/...
// router.use('/users', userRouter);     // -> /api/users/...
// router.use('/stories', storiesRouter); // -> /api/stories/...
export default router;
