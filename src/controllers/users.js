// src/controllers/users.js
import { UsersCollection } from '../db/models/users.js';
import { storiesCollection } from '../db/models/stories.js';

// Отримати список усіх користувачів
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UsersCollection.find({}, '_id name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Отримати одного користувача + його статті
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UsersCollection.findById(id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const stories = await storiesCollection
      .find({ ownerId: id })
      .select('_id title img date favoriteCount')
      .sort({ date: -1 })
      .lean();

    res.json({ user, stories });
  } catch (error) {
    next(error);
  }
};
import { getUserProfile } from '../services/users.js';
import createHttpError from 'http-errors';
import {
  getUserProfile,
  addStoryToSavedList,
  removeStoryFromSaved,
  updateCurrentUser,
  getUsers,
  updateUserAvatarService,
} from '../services/users.js';
import { getUserProfile } from '../services/users.js';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { updateUserAvatarService } from '../services/users.js';
import { getUserProfile, updateCurrentUser, getUsers } from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export async function getUsersController(req, res, next) {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const users = await getUsers({ page, perPage });

    res.status(200).json({
      status: 200,
      message: 'Users fetched',
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserProfileController(req, res, next) {
  try {
    const user = await getUserProfile(req.user._id.toString());
    res.status(200).json({
      status: 200,
      message: 'User profile fetched',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export const updateCurrentUserController = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    const userid = req.user._id;
    const updateData = req.body;
    const user = await updateCurrentUser(userid, updateData);

    res.status(200).json({
      status: 200,
      message: 'User data updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export async function addStoryToSavedController(req, res, next) {
  try {
    const { storyId } = req.body;

    if (!storyId) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error: Story ID is required.',
      });
    }

    const { user, message } = await addStoryToSavedList(
      req.user._id.toString(),
      storyId,
    );

    res.status(200).json({
      status: 200,
      message,
      data: {
        savedStories: user.selectedStories,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const updateUserAvatarController = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const user = await updateUserAvatarService({ userId, file: req.file });

    res.status(200).json({
      status: 200,
      message: 'Avatar updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
export const updateCurrentUserController = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    const { _id } = req.user;

  
    const updateData = req.body;

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }, 
    ).select('-password'); 
    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      status: 200,
      message: 'User data updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatarController = async (req, res, next) => {
  const userId = req.user?._id;
  const user = await updateUserAvatarService({ userId, file: req.file });

  res.status(200).json({
    status: 200,
    message: 'Avatar updated successfully',
    data: user,
  });
};