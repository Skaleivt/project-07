// src/controllers/stories.js

import createHttpError from 'http-errors';
import {
  createStory,
  getSavedStories,
  getStoryById,
  updateStory,
} from '../services/stories.js';
import { getAllStories } from '../services/stories.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterCategoryParams } from '../utils/parseFilterParams.js';
import { categoriesCollection } from '../db/models/categories.js';

export const getStoriesController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);

    const { sortField, sortOrder } = req.query;
    const filter = await parseFilterCategoryParams(req.query);

    const data = await getAllStories({
      page,
      perPage,
      filter,
      sortField,
      sortOrder,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully found stories!',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getStoryByIdController = async (req, res, next) => {
  const { id } = req.params;

  try {
    const story = await getStoryById(id);

    res.status(200).json({
      status: 200,
      message: 'Get id story',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

export const createStoryController = async (req, res, next) => {
  try {
    const { title, description: article, category } = req.body;
    const img = req.file;
    const userId = req.user._id;

    const story = await createStory(img, title, article, category, userId);

    res.status(201).json({
      message: 'Story created successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedStoriesController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, perPage } = req.query;
    const story = await getSavedStories(userId, page, perPage);

    res.status(201).json({
      message: 'Get saved stories',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStoryController = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const getCategoriesController = async (req, res, next) => {
  try {
    const categories = await categoriesCollection.find();

    res.status(200).json({
      status: 200,
      message: 'Get categories successfully!',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
