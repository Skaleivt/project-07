// src/controllers/users.js

import { getUserProfile, addStoryToSavedList } from '../services/users.js';

export async function getUserProfileController(req, res) {
  const user = await getUserProfile(req.user._id.toString());

  res.status(200).json({
    status: 200,
    message: 'Get a user info!',
    data: user,
  });
}

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
