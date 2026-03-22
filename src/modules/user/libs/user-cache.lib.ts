import { Injectable } from '@nestjs/common';
import { User } from '@/domains/entities';
import { UserCachePort } from '@/domains/ports/out';
import { RedisService } from '@/modules/shared/redis';
import { CachedUser } from '../types/cached-user.type';
import { UserMapper } from '../user.mapper';

@Injectable()
export class UserCache implements UserCachePort {
  public constructor(private readonly _redisService: RedisService) {}

  public async get(userId: string): Promise<User | null> {
    const key = this._getKeyByUserId(userId);

    const cached = await this._redisService.get<CachedUser>(key);

    if (!cached) return null;

    return UserMapper.mapFromCached(cached);
  }

  public async set(userId: string, user: User): Promise<void> {
    const key = this._getKeyByUserId(userId);
    const cached = UserMapper.mapToCached(user);

    await this._redisService.set<CachedUser>(key, cached);
  }

  public async delete(userId: string): Promise<void> {
    const key = this._getKeyByUserId(userId);

    await this._redisService.delete(key);
  }

  private _getKeyByUserId(userId: string): string {
    return `user:${userId}`;
  }
}
