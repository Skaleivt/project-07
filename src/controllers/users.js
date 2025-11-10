import {
  getUserProfile,
  addStoryToSavedList,
  updateCurrentUser,
  getUsers,
} from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export async function getUsersController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);

  const users = await getUsers({ page, perPage });

  res.status(200).json({
    status: 200,
    message: 'Get a user info!',
    data: users,
  });
}

export async function getUserProfileController(req, res) {
  const user = await getUserProfile(req.user._id.toString());

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

  res.status(200).json({
    status: 200,
    message: 'User data updated successfully',
    data: user,
  });
};

export async function addStoryToSavedController(req, res) {
  const { storyId } = req.body;

  if (!storyId) {
    return res.status(400).json({
      status: 400,
      message: 'Validation error: Story ID is required.',
    });
  }

  const { user, message } = await addStoryToSavedList(
    req.user._id.toString(),
    storyId,
  );

  res.status(200).json({
    status: 200,
    message: message,
    data: {
      savedStories: user.selectedStories,
    },
  });
}
