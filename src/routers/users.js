import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';
import {
  getUserProfileController,
  getUsersController,
} from '../controllers/users.js';

import { validateBody } from '../middlewares/validateBody.js';
import { updateUserValidationSchema } from '../validation/user.js';
import { updateCurrentUserController } from '../controllers/users.js';

const router = new Router();

router.get('/', getUsersController);

router.get('/current', authorization, getUserProfileController);

router.patch(
  '/current',
  authorization,
  validateBody(updateUserValidationSchema),
  updateCurrentUserController,
);

export const userRouter = router;
