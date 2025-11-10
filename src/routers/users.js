import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';
import {
  getUserProfileController,
  getUsersController,
  deleteStoryFromSavedController,
} from '../controllers/users.js';

import { validateBody } from '../middlewares/validateBody.js';
import { updateUserValidationSchema } from '../validation/user.js';
import { updateCurrentUserController } from '../controllers/users.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = new Router();

router.get('/', authorization, getUsersController);

router.get('/current', authorization, getUserProfileController);

router.patch(
  '/current',
  authorization,
  validateBody(updateUserValidationSchema),
  updateCurrentUserController,
);

router.delete(
  '/:storyId',
  authorization,
  isValidId,
  deleteStoryFromSavedController,
);

export const userRouter = router;
