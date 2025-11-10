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

  res.status(200).json({
    status: 200,
    message: 'User data updated successfully',
    data: user,
  });
};
