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

// 1. GET /api/stories
router.get('/', getStoriesController);

// 2. GET /api/stories/saved
router.get('/saved', authorization, getSavedStoriesController);

// 3. GET /api/stories/categories
router.get('/categories', getCategoriesController);

// 4. GET /api/stories/:id
router.get('/:id', isValidId, getStoryByIdController);

// 5. POST /api/stories
router.post(
  '/',
  authorization,
  upload.single('cover'),
  validateBody(createStoryValidationSchema),
  createStoryController,
);

// 6. PATCH /api/stories/:id
router.patch(
  '/:id',
  authorization,
  isValidId,
  upload.single('cover'),
  validateBody(refreshStoryValidationSchema),
  updateStoryController,
);

export const storiesRouter = router;
