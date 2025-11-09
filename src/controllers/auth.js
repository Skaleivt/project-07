import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, SEVEN_DAYS } from '../constants/index.js';
import {
  userRegisterService,
  userLoginService,
  refreshUserSession,
  logoutUserService,
} from '../services/auth.js';
import { SessionCollection } from '../db/models/sessions.js';
import createHttpError from 'http-errors';
import { clearAuthCookies } from '../utils/cookies.js';

export const createSession = async (userId) => {
  const accessToken = randomBytes(32).toString('base64');
  const refreshToken = randomBytes(32).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + SEVEN_DAYS);

  return SessionCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};

const setupSession = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAYS),
  });
};

export const userRegisterController = async (req, res) => {
  const user = await userRegisterService(req.body);

  const newSession = await createSession(user._id);
  setupSession(res, newSession);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
export const userLoginController = async (req, res) => {
  const user = await userLoginService(req.body);
  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setupSession(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: user,
  });
};

export const refreshUserSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const newSession = await refreshUserSession(sessionId, refreshToken);
  setupSession(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed!',
  });
};

export const userLogoutController = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) throw createHttpError(401, 'Unauthorized');

    const { sessionId, accessToken } = req.cookies || {};

    await logoutUserService({ userId, sessionId, accessToken });

    clearAuthCookies(res);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};