import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/users.js';
import { SessionCollection } from '../db/models/sessions.js';
import { createSession } from '../controllers/auth.js';

// ===== Реєстрація користувача =====
export const userRegisterService = async (body) => {
  const user = await UsersCollection.findOne({ email: body.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(body.password, 10);

  return await UsersCollection.create({ ...body, password: hashPassword });
};

// ===== Логін користувача =====
export const userLoginService = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid credentials');
  }

  return user;
};

// ===== Створення сесії =====
export async function loginUser(email, password) {
  const user = await UsersCollection.findOne({ email });

  if (user === null) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  return SessionCollection.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}
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
