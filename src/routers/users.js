import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';
import {
  getUserProfileController,
  updateCurrentUserController,
  deleteStoryFromSavedController,
} from '../controllers/users.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateUserValidationSchema } from '../validation/user.js';


const router = new Router();

router.get('/', authorization, getUserProfileController);

router.delete(
  '/:storyId',
  authorization,
  isValidId,
  deleteStoryFromSavedController,
);

router.patch(
  '/current',
  authorization,
  validateBody(updateUserValidationSchema),
  updateCurrentUserController,
);
export const userRouter = router;
