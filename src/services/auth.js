import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/users.js';
import { SessionCollection } from '../db/models/sessions.js';
import { createSession } from '../controllers/auth.js';

export const userRegisterService = async (body) => {
  const user = await UsersCollection.findOne({ email: body.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(body.password, 10);

  return await UsersCollection.create({ ...body, password: hashPassword });
};

export const userLoginService = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isPasswordValid = bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  return user;
};

export const refreshUserSession = async (sessionId, refreshToken) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = await createSession();

  return newSession;
};

export const logoutUserService = async ({ userId, sessionId, accessToken }) => {
  if (sessionId) {
    const res = await SessionCollection.deleteOne({ _id: sessionId, userId });
    return res.deletedCount > 0;
  }

  if (accessToken) {
    const res = await SessionCollection.deleteOne({ userId, accessToken });
    return res.deletedCount > 0;
  }
  return false;
};