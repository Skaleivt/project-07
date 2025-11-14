import createHttpError from 'http-errors';
import {
  createStory,
  getSavedStories,
  updateStory,
} from '../services/stories.js';
import { getAllStories } from '../services/stories.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterCategoryParams } from '../utils/parseFilterParams.js';
import { categoriesCollection } from '../db/models/categories.js';
import { storiesCollection } from '../db/models/stories.js';

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

export const getSavedStoriesController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = req.query;
  const story = await getSavedStories(userId, page, perPage);

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

export const getCategoriesController = async (req, res) => {
  const categories = await categoriesCollection.find();

  res.status(200).json({
    status: 200,
    message: 'Get categories successfully!',
    data: categories,
  });
};

export const getStoryByIdController = async (req, res, next) => {
  const { id } = req.params;

  const story = await storiesCollection
    .findById(id)
    .populate('ownerId', 'name avatarUrl')
    .populate('category', 'title');

  if (!story) {
    return res.status(404).json({
      status: 404,
      message: 'Story not found',
      data: null,
    });
  }

  const storyData = {
    _id: story._id,
    title: story.title,
    article: story.article,
    img: story.img,
    date: story.date,
    favoriteCount: story.favoriteCount || 0,
    owner: story.ownerId,
    category: story.category,
  };

  res.status(200).json({
    status: 200,
    message: 'Story found successfully',
    data: storyData,
  });
};
