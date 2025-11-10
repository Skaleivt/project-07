import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';

import {
  getUserProfileController,
  getUsersController,
  updateCurrentUserController,
  addStoryToSavedController,
} from '../controllers/users.js';

import { validateBody } from '../middlewares/validateBody.js';
import { updateUserValidationSchema } from '../validation/user.js';

const router = new Router();

router.get('/', authorization, getUsersController);

router.get('/current', authorization, getUserProfileController);

router.patch(
  '/current',
  authorization,
  validateBody(updateUserValidationSchema),
  updateCurrentUserController,
);

router.post('/saved', authorization, addStoryToSavedController);

export const userRouter = router;
