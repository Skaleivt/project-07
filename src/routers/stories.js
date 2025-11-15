import { Router } from 'express';
import {
  createStoryController,
  updateStoryController,
  getStoriesController,
  getSavedStoriesController,
  getCategoriesController,
} from '../controllers/stories.js';
import { authorization } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createStoryValidationSchema,
  refreshStoryValidationSchema,
} from '../validation/stories.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/upload.js';
import { getStoryById } from '../services/stories.js';

const router = Router();

router.get('/', getStoriesController);

router.get('/:id', getStoryById);

router.post(
  '/',
  authorization,
  validateBody(createStoryValidationSchema),
  upload.single('img'),
  createStoryController,
);

router.get('/owner-stories', authorization, getSavedStoriesController);

router.get('/categories', getCategoriesController);

router.patch(
  '/:id',
  authorization,
  isValidId,
  validateBody(refreshStoryValidationSchema),
  upload.single('img'),
  updateStoryController,
);

export const storiesRouter = router;
