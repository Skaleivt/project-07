import { Router } from 'express';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  userRegisterController,
  userLoginController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(userRegisterController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(userLoginController),
);

export const authRouter = router;
