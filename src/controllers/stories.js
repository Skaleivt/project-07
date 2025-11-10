import createHttpError from 'http-errors';
import { storiesCollection } from '../db/models/stories.js';
import { updateStory } from '../services/stories.js';
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

export const createStoryController = async (req, res, next) => {
  try {
    const { img, title, description, category } = req.body;

    if (!req.user) {
      throw new createHttpError.Unauthorized('Not authenticated');
    }

    const story = await storiesCollection.create({
      img,
      title,
      article: description,
      category,
      ownerId: req.user._id,
      date: new Date(),
      favoriteCount: 0,
    });

    res.status(201).json({
      message: 'Story created successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStoryController = async (req, res) => {
  if (!req.user) {
    throw new createHttpError.Unauthorized('Not authenticated');
  }

  const story = await updateStory(req.params.id, req.user._id, req.body);

  if (!story) {
    throw new createHttpError.NotFound('Story not found or not yours');
  }

  res.status(200).json({
    status: 200,
    message: 'Update story successfully!',
    data: story,
  });
};
