import { DeviceInfo } from '@/domains/types';

export type CachedSession = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  deviceInfo: DeviceInfo;
  isRevoked: boolean;
  expiresAt: string;
  lastUsedAt: string;
  createdAt: string;
};
