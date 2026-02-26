export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secretKey',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresInRememberMeDays: Number(
    process.env.JWT_REFRESH_REMEMBER_ME_DAYS || 30
  ),
  refreshExpiresInSessionHours: Number(
    process.env.JWT_REFRESH_SESSION_HOURS || 24
  ),
  resetPasswordTokenMinutes: Number(
    process.env.RESET_PASSWORD_TOKEN_MINUTES || 20
  ),
};

export const cookieConstants = {
  refreshTokenName: 'blabla_refresh_token',
};
