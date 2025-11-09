import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { SessionCollection } from '../db/models/sessions.js';

export const authorization = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    next(createHttpError(401, 'Please log in or register'));
    return;
  }

  const session = await SessionCollection.findOne({
    accessToken: req.cookies.accessToken,
  });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    return next(createHttpError(401));
  }

  req.user = user;
  next();
};


