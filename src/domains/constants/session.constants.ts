export const SESSION_CONSTANTS = {
  refreshTokenExpiresIn: '7d',
  refreshTokenExpiresInMs: 7 * 24 * 60 * 60 * 1000,
  accessTokenExpiresIn: '15m',
  accessTokenExpiresInMs: 15 * 60 * 1000,
  extendThreshold: '1d',
  extendThresholdMs: 24 * 60 * 60 * 1000,
} as const;
