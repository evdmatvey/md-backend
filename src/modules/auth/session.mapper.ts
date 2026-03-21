import { Session } from '@/domains/entities';
import { SessionEntity } from './entities/session.entity';

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
}
