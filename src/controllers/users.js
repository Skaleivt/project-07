import { getUserProfile } from '../services/users.js';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { updateUserAvatarService } from '../services/users.js';
import { getUserProfile, updateCurrentUser, getUsers } from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';


export async function getUsersController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);

  const users = await getUsers({page, perPage});

  res.status(200).json({
    status: 200,
    message: 'Get a user info!',
    data: users,
  });
}

export async function getUserProfileController(req, res) {
  const user = await getUserProfile(req.user._id);

  res.status(200).json({
    status: 200,
    message: 'Get a user info!',
    data: user,
  });
}

export const updateCurrentUserController = async (req, res) => {
  const userid = req.user._id;

  const updateData = req.body;
  const user = await updateCurrentUser(userid, updateData);

export const updateCurrentUserController = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createHttpError(401, 'Not authenticated');
    }

    const { _id } = req.user;

  
    const updateData = req.body;

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }, 
    ).select('-password'); 
    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
      status: 200,
      message: 'User data updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatarController = async (req, res, next) => {
  const userId = req.user?._id;
  const user = await updateUserAvatarService({ userId, file: req.file });

  res.status(200).json({
    status: 200,
    message: 'Avatar updated successfully',
    data: user,
  });
};
