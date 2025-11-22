// src/services/users.js
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { storiesCollection } from '../db/models/stories.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllUsers(page = 1, perPage = 4) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const [usersCount, users] = await Promise.all([
    UsersCollection.countDocuments(),
    UsersCollection.find().skip(skip).limit(limit),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);
  return { data: users, ...paginationData };
}

export async function getUserById(userId) {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(400, "Don't found user");
  }

  const stories = await storiesCollection
    .find({ ownerId: userId })
    .select('_id title img date favoriteCount')
    .sort({ date: -1 });

  return { user, stories };
}

export async function getUserProfile(userId) {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(400, "Don't found user");
  }
  return user;
}

export async function updateCurrentUser(userId, payload) {
  const updatedUser = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    payload,
    { new: true },
  ).select('-password');

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  return updatedUser;
}

export async function addStoryToSavedList(userId, storyId) {
  const storyExists = await storiesCollection.findByIdAndUpdate(
    storyId,
    { $inc: { favoriteCount: 1 } },
    { new: true },
  );
  if (!storyExists) {
    throw createHttpError(404, 'Story not found');
  }
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const alreadySaved = user.selectedStories.some(
    (id) => id.toString() === storyId,
  );

  if (alreadySaved) {
    throw createHttpError(400, 'Story was already saved by this user');
  }

  user.selectedStories.push(storyId);
  user.markModified('selectedStories');

  await user.save();

  return user;
}

export async function removeStoryFromSavedList(userId, storyId) {
  const user = await UsersCollection.findById(userId).select('selectedStories');
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  await storiesCollection.findByIdAndUpdate(
    storyId,
    { $inc: { favoriteCount: -1 } },
    { new: true },
  );

  const isSaved = user.selectedStories.some((id) => id.toString() === storyId);
  if (!isSaved) {
    return { user, message: 'Story was not in the saved list' };
  }

  await UsersCollection.findByIdAndUpdate(
    userId,
    { $pull: { selectedStories: storyId } },
    { new: true },
  );
  const updatedUser = await UsersCollection.findById(userId).select(
    'selectedStories',
  );

  return { user: updatedUser, message: 'Story removed from saved list' };
}

export const updateUserAvatarService = async ({ userId, file }) => {
  if (!file) {
    throw createHttpError(400, 'Avatar file is required');
  }

  const uploaded = await uploadToCloudinary(file.path);
  const avatarURL = uploaded.secure_url || uploaded.url;

  if (!avatarURL) {
    throw createHttpError(500, 'Failed to get avatar URL');
  }

  const updatedUser = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    { avatarUrl: avatarURL },
    { new: true },
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  return updatedUser;
};
