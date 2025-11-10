import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export async function getUserProfile(userId) {
  const user = await UsersCollection.findOne({ _id: userId });

  if (!user) {
    throw createHttpError(400, 'Don`t found user');
  }

  return user;
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
  ).lean();

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  return updatedUser;

};