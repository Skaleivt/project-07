import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { storiesCollection } from '../db/models/stories.js';
import { Types } from 'mongoose';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getUsers({ page = 1, perPage = 10 }) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const [usersCount, users] = await Promise.all([
    UsersCollection.countDocuments(),
    UsersCollection.find().skip(skip).limit(limit),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return {
    data: users,
    ...paginationData,
  };
}

export async function getUserProfile(userId) {
  const user = await UsersCollection.findOne({ _id: userId });

  if (!user) {
    throw createHttpError(400, 'Don`t found user');
  }

  return user;
}

export async function updateCurrentUser(userId, payload) {
  const updatedUser = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    payload,
    {
      new: true,
    },
  ).select('-password');

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  return updatedUser;
}

/**
 * Adds a story to the user's selected stories list.
 * @param {string} userId - ID of the current user.
 * @param {string} storyId - ID of the story to be saved.
 * @returns {object} Object with the updated user data and action message.
 */
export async function addStoryToSavedList(userId, storyId) {
  if (!Types.ObjectId.isValid(storyId)) {
    throw createHttpError(400, 'Invalid story ID format');
  }

  const storyExists = await storiesCollection.exists({ _id: storyId });
  if (!storyExists) {
    throw createHttpError(404, `Story with ID ${storyId} not found`);
  }

  const storyObjectId = new Types.ObjectId(storyId);

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { $addToSet: { selectedStories: storyObjectId } },
    { new: true, select: 'selectedStories' },
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  const isNew = updatedUser.selectedStories.some(
    (id) => id.toString() === storyId,
  );

  return {
    user: updatedUser,
    message: isNew
      ? 'Story successfully added to saved list'
      : 'Story was already saved by this user',
  };
}
