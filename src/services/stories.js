import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { storiesCollection } from '../db/models/stories.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import createHttpError from 'http-errors';

export const getAllStories = async ({ page, perPage, filter }) => {
  const skip = (page - 1) * perPage;

  const storiesQuery = storiesCollection.find();

  if (filter.category) {
    storiesQuery.where('category').equals(filter.category);
  }

  const [storiesCount, stories] = await Promise.all([
    storiesCollection.find().merge(storiesQuery).countDocuments(),
    storiesQuery.skip(skip).limit(perPage).exec(),
  ]);

  const paginationData = calculatePaginationData(storiesCount, page, perPage);

  return {
    data: stories,
    ...paginationData,
  };
};

export const createStory = async (
  img,
  title,
  description,
  category,
  userId,
) => {
  const uploaded = await uploadToCloudinary(img.path);
  const avatarURL = uploaded.secure_url || uploaded.url;

  if (!avatarURL) {
    throw createHttpError(500, 'Failed to get avatar URL');
  }

  const story = await storiesCollection.create({
    img: avatarURL,
    title,
    article: description,
    category,
    ownerId: userId,
    date: new Date(Date.now()),
  });
  if (!story) {
    throw createHttpError(400, 'Failed to get story');
  }

  return story;
};

export const updateStory = async (
  storyId,
  userId,
  img,
  payload,
  options = { new: true },
) => {
  const uploaded = await uploadToCloudinary(img.path);
  const avatarURL = uploaded.secure_url || uploaded.url;

  if (!avatarURL) {
    throw createHttpError(500, 'Failed to get avatar URL');
  }
  console.log('fvcsnjkmd,::::', storyId, userId);

  const story = await storiesCollection.findOneAndUpdate(
    { _id: storyId, ownerId: userId },
    { ...payload, img: avatarURL },
    options,
  );
  return story;
};
