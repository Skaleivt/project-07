import { Router } from 'express';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  userRegisterController,
  userLoginController,
  refreshUserSessionController,
  userLogoutController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authorization } from '../middlewares/authenticate.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  userRegisterController,
);
router.post('/login', validateBody(loginUserSchema), userLoginController);
router.post('/refresh', refreshUserSessionController);
router.post('/logout', authorization, userLogoutController);

export const authRouter = router;
