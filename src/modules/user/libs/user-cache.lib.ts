import { Injectable } from '@nestjs/common';
import { User } from '@/domains/entities';
import { UserCachePort } from '@/domains/ports/out';
import { RedisService } from '@/modules/shared/redis';

@Injectable()
export class UserCache implements UserCachePort {
  public constructor(private readonly _redisService: RedisService) {}

  public async get(userId: string): Promise<User | null> {
    const key = this._getKeyByUserId(userId);

    return this._redisService.get<User>(key);
  }

  public async set(userId: string, user: User): Promise<void> {
    const key = this._getKeyByUserId(userId);

    await this._redisService.set<User>(key, user);
  }

  public async delete(userId: string): Promise<void> {
    const key = this._getKeyByUserId(userId);

    await this._redisService.delete(key);
  }

  private _getKeyByUserId(userId: string): string {
    return `user:${userId}`;
  }
}
