import { getUserProfile, deleteStoryFromSaved } from '../services/users.js';

export async function getUserProfileController(req, res) {
  const user = await getUserProfile(req.user._id);

  res.status(200).json({
    status: 200,
    message: 'Get a user info!',
    data: user,
  });
}

export const deleteStoryFromSavedController = async (req, res, next) => {
  const { storyId } = req.params;
  const userId = req.user.id;

  const story = await deleteStoryFromSaved(storyId, userId);

  if (!story) {
    return res.status(404).json({
      status: 404,
      message: 'Story not found.',
    });
  }

  res.status(204).send();
};
