import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { storiesCollection } from '../db/models/stories.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getUsers({ page = 1, perPage = 10 }) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const [usersCount, users] = await Promise.all([
    UsersCollection.countDocuments(),
    UsersCollection.find().skip(skip).limit(limit),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);
  return { data: users, ...paginationData };
}

export async function getUserProfile(userId) {
  const user = await UsersCollection.findOne({ _id: userId });
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

export const updateUserAvatarService = async ({ userId, file }) => {
  if (!userId) {
    throw createHttpError(401, 'Unauthorized');
  }

  if (!file) {
    throw createHttpError(400, 'Avatar file is required');
  }

  const uploaded = await uploadToCloudinary(file.path);
  const avatarURL = uploaded.secure_url || uploaded.url;

  if (!avatarURL) {
    throw createHttpError(500, 'Failed to get avatar URL');
  }

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { avatarURL },
    { new: true },
  )
    .select('-password')
    .lean();

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  return updatedUser;
};

export async function addStoryToSavedList(userId, storyId) {
  const storyExists = await storiesCollection.findById(storyId);
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
  await user.save();

  return user;
}
