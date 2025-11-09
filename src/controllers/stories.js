import createHttpError from 'http-errors';

import { storiesCollection } from '../db/models/stories.js';
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

export const updateStoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { img, title, description, category } = req.body;

    if (!req.user) {
      throw new createHttpError.Unauthorized('Not authenticated');
    }

    const story = await storiesCollection.findById(id);

    if (!story) {
      throw new createHttpError.NotFound('Story not found');
    }
    if (story.ownerId.toString() !== req.user._id.toString()) {
      throw new createHttpError.Forbidden('You can edit only your own stories');
    }

    story.img = img || story.img;
    story.title = title || story.title;
    story.article = description || story.article;
    story.category = category || story.category;

    await story.save();

    res.status(200).json({
      message: 'Story updated successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};
