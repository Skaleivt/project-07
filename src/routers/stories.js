import { Router } from 'express';
import {
  createStoryController,
  updateStoryController,
  getStoriesController,
  getSavedStoriesController,
  getCategoriesController,
  getStoryByIdController,
} from '../controllers/stories.js';
import { authorization } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createStoryValidationSchema,
  refreshStoryValidationSchema,
} from '../validation/stories.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/', getStoriesController);

router.get('/owner-stories', authorization, getSavedStoriesController);

router.get('/categories', getCategoriesController);

router.get('/:id', getStoryByIdController);

router.post(
  '/',
  authorization,
  upload.single('cover'),
  validateBody(createStoryValidationSchema),
  createStoryController,
);

router.patch(
  '/:id',
  authorization,
  isValidId,
  validateBody(refreshStoryValidationSchema),
  upload.single('cover'),
  updateStoryController,
);

export const storiesRouter = router;
