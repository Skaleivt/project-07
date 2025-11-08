import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  getUserProfileController,
  deleteStoryFromSavedController,
} from '../controllers/users.js';

const router = new Router();

router.get('/', authorization, getUserProfileController);

router.delete(
  '/:storyId',
  authorization,
  isValidId,
  deleteStoryFromSavedController,
);

export const userRouter = router;
