import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
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

};
