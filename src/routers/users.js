import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';
import { getUserProfileController } from '../controllers/users.js';

import { validateBody } from '../middlewares/validateBody.js';
import { updateUserValidationSchema } from '../validation/user.js';
import { updateCurrentUserController } from '../controllers/users.js';

import { upload } from '../middlewares/upload.js';
import { updateUserAvatarController } from '../controllers/users.js';

const router = new Router();

router.get('/', authorization, getUserProfileController);

router.patch(
  '/current',
  authorization,
  validateBody(updateUserValidationSchema),
  updateCurrentUserController,
);

router.patch(
  '/avatar',
  authorization,
  upload.single('avatar'),
  updateUserAvatarController,
);

export const userRouter = router;
