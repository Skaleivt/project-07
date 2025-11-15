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
import { addStoryToSaved } from '../services/stories.js';

const router = Router();

router.get('/', getStoriesController);

router.get('/owner-stories', authorization, getSavedStoriesController);

router.get('/categories', getCategoriesController);

router.get('/:id', getStoryByIdController);

router.post(
  '/',
  authorization,
  validateBody(createStoryValidationSchema),
  upload.single('img'),
  createStoryController,
);

router.post('/save/:id', authorization, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const updatedUser = await addStoryToSaved(userId, id);

    res.status(200).json({
      success: true,
      message: 'Story saved successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:id',
  authorization,
  isValidId,
  validateBody(refreshStoryValidationSchema),
  upload.single('img'),
  updateStoryController,
);

export const storiesRouter = router;
