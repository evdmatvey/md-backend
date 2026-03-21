import { Injectable } from '@nestjs/common';
import { Session } from '@/domains/entities';
import { SessionCachePort } from '@/domains/ports/out';
import { RedisService } from '@/modules/shared/redis';

@Injectable()
export class SessionCache implements SessionCachePort {
  public constructor(private readonly _redisService: RedisService) {}

  public async get(sessionId: string): Promise<Session | null> {
    const key = this._getKeyBySessionId(sessionId);

    return this._redisService.get<Session>(key);
  }

  public async set(sessionId: string, session: Session): Promise<void> {
    const key = this._getKeyBySessionId(sessionId);

    await this._redisService.set(key, session);
  }

  public async delete(sessionId: string): Promise<void> {
    const key = this._getKeyBySessionId(sessionId);

    await this._redisService.delete(key);
  }

  private _getKeyBySessionId(sessionId: string): string {
    return `session:${sessionId}`;
  }
}
