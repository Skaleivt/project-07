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
