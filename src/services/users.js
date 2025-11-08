import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';

export async function getUserProfile(userId) {
  const user = await UsersCollection.findOne({ _id: userId });

  if (!user) {
    throw createHttpError(400, 'Don`t found user');
  }

  return user;
}

export const deleteStoryFromSaved = async (storyId, userId) => {
  const contact = await UsersCollection.findOneAndDelete({
    _id: storyId,
    userId,
  });
  return contact;
};
