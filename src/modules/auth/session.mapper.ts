import { Session } from '@/domains/entities';
import { SessionEntity } from './entities/session.entity';
import { CachedSession } from './types/cached-session.type';

export class SessionMapper {
  public static mapToDomain(entity: SessionEntity): Session {
    const {
      id,
      userId,
      isRevoked,
      refreshTokenHash,
      os,
      browser,
      expiresAt,
      lastUsedAt,
      createdAt,
    } = entity;

    return new Session(
      id,
      userId,
      refreshTokenHash,
      { browser, os },
      isRevoked,
      expiresAt,
      lastUsedAt,
      createdAt,
    );
  }

  public static mapToCached(session: Session): CachedSession {
    const {
      id,
      userId,
      deviceInfo,
      refreshTokenHash,
      isRevoked,
      expiresAt,
      lastUsedAt,
      createdAt,
    } = session;

    return {
      id,
      userId,
      refreshTokenHash,
      deviceInfo,
      isRevoked,
      expiresAt: expiresAt.toISOString(),
      lastUsedAt: lastUsedAt.toISOString(),
      createdAt: createdAt.toISOString(),
    };
  }

  public static mapFromCached(cached: CachedSession): Session {
    const {
      id,
      userId,
      deviceInfo,
      refreshTokenHash,
      isRevoked,
      expiresAt,
      lastUsedAt,
      createdAt,
    } = cached;

    return new Session(
      id,
      userId,
      refreshTokenHash,
      deviceInfo,
      isRevoked,
      new Date(expiresAt),
      new Date(lastUsedAt),
      new Date(createdAt),
    );
  }
}
