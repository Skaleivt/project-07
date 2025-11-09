import { Router } from 'express';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  userRegisterController,
  userLoginController,
  refreshUserSessionController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  userRegisterController,
);
router.post('/login', validateBody(loginUserSchema), userLoginController);
router.post('/refresh', refreshUserSessionController);

export const authRouter = router;
