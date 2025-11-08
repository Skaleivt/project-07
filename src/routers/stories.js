import { Router } from 'express';
import {
  getStoriesController,
  createStoryController,
} from '../controllers/stories.js';
import { authorization } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createStoryValidationSchema } from '../validation/stories.js';

const router = Router();

router.get('/', getStoriesController);

router.post(
  '/',
  authorization,
  validateBody(createStoryValidationSchema),
  createStoryController,
);

export const storiesRouter = router;
