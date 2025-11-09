import { getUserProfile } from '../services/users.js';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';


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

export const updateUserAvatarController = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw createHttpError(401, 'Unauthorized');
    }

    if (!req.file) {
      throw createHttpError(400, 'Avatar file is required');
    }

    const result = await uploadToCloudinary(req.file.path);
    const avatarURL = result.secure_url || result.url;

    const updated = await UsersCollection.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true },
    ).lean();

    return res.status(200).json({
      status: 200,
      message: 'Avatar updated successfully',
      data: { avatarURL: updated?.avatarURL },
    });
  } catch (err) {
    next(err);
  }
};