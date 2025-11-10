import { storiesCollection } from '../db/models/stories.js';

export const updateStory = async (
  storyId,
  userId,
  payload,
  options = { new: true },
) => {
  const story = await storiesCollection.findOneAndUpdate(
    { _id: storyId, ownerId: userId },
    payload,
    options,
  );
  return story;
};
