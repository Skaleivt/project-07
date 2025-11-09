import { getUserProfile } from '../services/users.js';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';


export async function getUserProfileController(req, res) {
  const user = await getUserProfile(req.user._id);

  res.status(200).json({
    status: 200,
    message: 'Get a user info!',
    data: user,
  });
}


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