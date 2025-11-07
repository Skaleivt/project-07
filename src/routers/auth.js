import { Router } from 'express';
import { registerUserSchema } from '../validation/auth.js';
import { userRegisterController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  userRegisterController,
);

export const authRouter = router;
