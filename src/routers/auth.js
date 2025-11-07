import { Router } from 'express';
import { registerUserSchema } from '../validation/auth.js';
import { userRegisterController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post('/login', (req, res) => {
  return res.status(200).json({
    message: 'Login endpoint works!',
  });
});
router.post(
  '/register',
  validateBody(registerUserSchema),
  userRegisterController,
);

export const authRouter = router;
