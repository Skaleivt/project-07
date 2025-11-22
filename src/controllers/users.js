// src/controllers/users.js
import {
  getAllUsers,
  getUserProfile,
  addStoryToSavedList,
  removeStoryFromSavedList,
  updateCurrentUser,
  updateUserAvatarService,
  getUserById,
} from '../services/users.js';

// Отримати список усіх користувачів
export const getAllUsersController = async (req, res) => {
  const { page, perPage } = req.query;

  const users = await getAllUsers(page, perPage);

  res.status(200).json({
    status: 200,
    message: 'Get all users',
    data: users,
  });
};

// Отримати одного користувача + його статті
export const getUserByIdController = async (req, res) => {
  const { id } = req.params;

  const user = await getUserById(id);

  res.status(200).json({
    status: 200,
    message: 'Get id user',
    data: user,
  });
};

// отримання даних профіля користувача
export async function getUserProfileController(req, res) {
  const userId = req.user._id;

  const user = await getUserProfile(userId);

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

  const user = await addStoryToSavedList(req.user._id, storyId);

  res.status(200).json({
    status: 200,
    message: 'Story successfully added',
    data: {
      savedStories: user.selectedStories,
    },
  });
}

export async function removeStoryFromSavedController(req, res, next) {
  try {
    const { storyId } = req.body;

    const { user, message } = await removeStoryFromSavedList(
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

// Оновлення аватару користувача
export const updateUserAvatarController = async (req, res) => {
  const userId = req.user._id;
  const user = await updateUserAvatarService({ userId, file: req.file });

  res.status(200).json({
    status: 200,
    message: 'Avatar updated successfully',
    data: user,
  });
};
