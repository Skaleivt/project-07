import { Router } from 'express';
import {
  createStoryController,
  updateStoryController,
  getStoriesController,
} from '../controllers/stories.js';
import { authorization } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createStoryValidationSchema,
  refreshStoryValidationSchema,
} from '../validation/stories.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', getStoriesController);

router.post(
  '/',
  authorization,
  validateBody(createStoryValidationSchema),
  createStoryController,
);

router.patch(
  '/:id',
  authorization,
  isValidId,
  validateBody(refreshStoryValidationSchema),
  updateStoryController,
);

export const storiesRouter = router;
