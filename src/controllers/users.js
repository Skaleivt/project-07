import { getUserProfile, updateCurrentUser } from '../services/users.js';

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

  res.status(200).json({
    status: 200,
    message: 'User data updated successfully',
    data: user,
  });
};
