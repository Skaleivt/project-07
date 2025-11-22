// src/routers/users.js
import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';
import {
  getUserProfileController,
  updateCurrentUserController,
  addStoryToSavedController,
  removeStoryFromSavedController,
  updateUserAvatarController,
  getAllUsersController,
  getUserByIdController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateUserValidationSchema } from '../validation/user.js';
import { isValidStoryIdSchema } from '../validation/stories.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', getAllUsersController);

router.get('/current', authorization, getUserProfileController);

router.get('/:id', getUserByIdController);

router.patch(
  '/current',
  authorization,
  validateBody(updateUserValidationSchema),
  updateCurrentUserController,
);

router.post(
  '/saved',
  authorization,
  validateBody(isValidStoryIdSchema),
  addStoryToSavedController,
);

router.delete(
  '/saved',
  authorization,
  validateBody(isValidStoryIdSchema),
  removeStoryFromSavedController,
);

router.patch(
  '/avatar',
  authorization,
  upload.single('avatar'),
  updateUserAvatarController,
);

export const usersRouter = router;
