// src/routers/users.js
import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';
import {
  getUserProfileController,
  getUsersController,
  updateCurrentUserController,
  addStoryToSavedController,
  updateUserAvatarController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateUserValidationSchema } from '../validation/user.js';
import { addSavedStoryValidationSchema } from '../validation/stories.js';
import { upload } from '../middlewares/upload.js';

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
