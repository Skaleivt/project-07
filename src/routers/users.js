// src/routers/users.js
import { Router } from 'express';
import { getUserById, getAllUsers } from '../controllers/users.js';

const router = Router();

/**
 * GET /api/users
 * Отримати список усіх користувачів
 */
router.get('/', getAllUsers);

/**
 * GET /api/users/:id
 * Отримати одного користувача + його історії
 */
router.get('/:id', getUserById);

export default router;
import { authorization } from '../middlewares/authenticate.js';
import { getUserProfileController } from '../controllers/users.js';
import { authorization } from '../middlewares/authenticate.js';
import {
  getUserProfileController,
  getUsersController,
  updateCurrentUserController,
  addStoryToSavedController,
  removeStoryFromSavedController,
  updateUserAvatarController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateUserValidationSchema } from '../validation/user.js';
import { addSavedStoryValidationSchema } from '../validation/stories.js';
import { upload } from '../middlewares/upload.js';
import { updateCurrentUserController } from '../controllers/users.js';

import { upload } from '../middlewares/upload.js';
import { updateUserAvatarController } from '../controllers/users.js';


const router = Router();

router.get('/', authorization, getUsersController);
router.get('/current', authorization, getUserProfileController);

router.patch(
  '/current',
  authorization,
  validateBody(updateUserValidationSchema),
  updateCurrentUserController,
);

router.post(
  '/saved',
  authorization,
  validateBody(addSavedStoryValidationSchema),
  addStoryToSavedController,
);

router.patch(
  '/avatar',
  authorization,
  upload.single('avatar'),
  updateUserAvatarController,
);

export const userRouter = router;
export default router;