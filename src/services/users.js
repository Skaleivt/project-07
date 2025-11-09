import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';

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
