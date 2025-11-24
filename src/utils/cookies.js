// src/utils/cookies.js
export const authCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
});

export const clearAuthCookies = (res) => {
  const opts = authCookieOptions();
  res.clearCookie('accessToken', opts);
  res.clearCookie('refreshToken', opts);
  res.clearCookie('sessionId', opts);
};
