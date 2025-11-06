import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

export const authorization = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new createHttpError(401, 'Please provide Authorization header');
  }

  const [bearer, token] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }
  const session = await SessionCollection.findOne({ accessToken: token });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;
  next();
};
