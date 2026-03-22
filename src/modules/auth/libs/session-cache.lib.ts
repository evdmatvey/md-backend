import { Injectable } from '@nestjs/common';
import { Session } from '@/domains/entities';
import { SessionCachePort } from '@/domains/ports/out';
import { RedisService } from '@/modules/shared/redis';
import { SessionMapper } from '../session.mapper';
import { CachedSession } from '../types/cached-session.type';

@Injectable()
export class SessionCache implements SessionCachePort {
  public constructor(private readonly _redisService: RedisService) {}

  public async get(sessionId: string): Promise<Session | null> {
    const key = this._getKeyBySessionId(sessionId);

    const cached = await this._redisService.get<CachedSession>(key);

    if (!cached) return null;

    return SessionMapper.mapFromCached(cached);
  }

  public async set(sessionId: string, session: Session): Promise<void> {
    const key = this._getKeyBySessionId(sessionId);
    const cached = SessionMapper.mapToCached(session);

    await this._redisService.set(key, cached);
  }

  public async delete(sessionId: string): Promise<void> {
    const key = this._getKeyBySessionId(sessionId);

    await this._redisService.delete(key);
  }

  private _getKeyBySessionId(sessionId: string): string {
    return `session:${sessionId}`;
  }
}
