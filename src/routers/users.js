// src/routers/users.js
import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';
import {
  getUserProfileController,
  getUsersController,
  updateCurrentUserController,
  addStoryToSavedController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  updateUserValidationSchema,
  addSavedStoryValidationSchema,
} from '../validation/user.js';

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

export const userRouter = router;
export default router;
