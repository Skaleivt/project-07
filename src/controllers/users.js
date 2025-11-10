// src/controllers/users.js
import { UsersCollection } from '../db/models/users.js';
import { storiesCollection } from '../db/models/stories.js';
import { getUserProfile } from '../services/users.js';
import {
  addStoryToSavedList,
  updateCurrentUser,
  getUsers,
  updateUserAvatarService,
} from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

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
export const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await UsersCollection.findById(id).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });

  const stories = await storiesCollection
    .find({ ownerId: id })
    .select('_id title img date favoriteCount')
    .sort({ date: -1 })
    .lean();

  res.status(200).json({
    status: 200,
    message: 'Get id user',
    data: { user, stories },
  });
};

// Публічний отримання користувачів
export async function getUsersController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const users = await getUsers({ page, perPage });

  res.status(200).json({
    status: 200,
    message: 'Users fetched',
    data: users,
  });
}

// отримання даних профіля користувача
export async function getUserProfileController(req, res) {
  const user = await getUserProfile(req.user._id.toString());

  res.status(200).json({
    status: 200,
    message: 'User profile fetched',
    data: user,
  });
}

// Оновлення даних користувача приватний
export const updateCurrentUserController = async (req, res) => {
  const userid = req.user._id;
  const updateData = req.body;
  const user = await updateCurrentUser(userid, updateData);

  res.status(200).json({
    status: 200,
    message: 'User data updated successfully',
    data: user,
  });
};

// Додавання історії до збережених
export async function addStoryToSavedController(req, res) {
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
}

// Оновлення аватару користувача
export const updateUserAvatarController = async (req, res) => {
  const userId = req.user?._id;
  const user = await updateUserAvatarService({ userId, file: req.file });

  res.status(200).json({
    status: 200,
    message: 'Avatar updated successfully',
    data: user,
  });
};
