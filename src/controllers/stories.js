import createHttpError from 'http-errors';
import { createStory, updateStory } from '../services/stories.js';
import { getAllStories } from '../services/stories.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterCategoryParams } from '../utils/parseFilterParams.js';

export const getStoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const filter = await parseFilterCategoryParams(req.query);

  const data = await getAllStories({
    page,
    perPage,
    filter,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found stories!',
    data,
  });
};

export const createStoryController = async (req, res) => {
  const { title, description, category } = req.body;
  const img = req.file;
  const userId = req.user._id;

  const story = await createStory(img, title, description, category, userId);

  res.status(201).json({
    message: 'Story created successfully',
    data: story,
  });
};

export const updateStoryController = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const img = req.file;
  const updateBody = req.body;

  const story = await updateStory(id, userId, img, updateBody);

  if (!story) {
    throw new createHttpError.NotFound('Story not found or not yours');
  }

  res.status(200).json({
    status: 200,
    message: 'Update story successfully!',
    data: story,
  });
};
