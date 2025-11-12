import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { storiesCollection } from '../db/models/stories.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';

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

export const getSavedStories = async (userId, page = 1, perPage = 6) => {
  const user = await UsersCollection.findById(userId).select('selectedStories');
  const storiesId = user.selectedStories;
  const limit = Number(perPage);
  const skip = (page - 1) * perPage;
  const total = storiesId.length;

  if (!storiesId) {
    throw createHttpError(404, 'User not found');
  }

  const paginatedIds = storiesId.slice(skip, skip + limit);

  const stories = await storiesCollection.find({
    _id: { $in: paginatedIds },
  });

  if (!stories) {
    throw createHttpError(404, 'User don`t have saved stories');
  }

  const paginationData = calculatePaginationData(
    total,
    Number(perPage),
    Number(page),
  );
  return { data: stories, ...paginationData };
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

  const story = await storiesCollection.findOneAndUpdate(
    { _id: storyId, ownerId: userId },
    { ...payload, img: avatarURL },
    options,
  );
  return story;
};
