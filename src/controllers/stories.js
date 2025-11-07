import createHttpError from 'http-errors';
import { storiesCollection } from '../db/models/stories.js';

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