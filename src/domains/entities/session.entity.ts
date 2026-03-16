import { SESSION_CONSTANTS } from '../constants';
import { DeviceInfo } from '../types';
import { EntityWithId } from './entity-with-id.entity';

export class Session extends EntityWithId {
  public constructor(
    id: string,
    public readonly userId: string,
    public refreshTokenHash: string,
    public deviceInfo: DeviceInfo,
    public isRevoked: boolean,
    public expiresAt: Date,
    public lastUsedAt: Date,
    public readonly createdAt: Date,
  ) {
    super(id);
  }

  public extend(refreshTokenHash: string) {
    this.refreshTokenHash = refreshTokenHash;
    this.expiresAt = new Date(
      Date.now() + SESSION_CONSTANTS.refreshTokenExpiresInMs,
    );
  }

  public revoke(): void {
    this.isRevoked = true;
  }

  public get isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  public get isAboutToExpire(): boolean {
    const lifeTime = this.expiresAt.getTime() - Date.now();

    return lifeTime > 0 && lifeTime < SESSION_CONSTANTS.extendThresholdMs;
  }
}
