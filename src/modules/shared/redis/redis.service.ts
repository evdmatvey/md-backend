import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type RedisClientType } from '@redis/client';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private _client: RedisClientType;
  private readonly _defaultTtlSeconds = 86400;

  public constructor(private readonly _configService: ConfigService) {
    this._connect();
  }

  private async _connect() {
    const host = this._configService.getOrThrow<string>('REDIS_HOST');
    const port = this._configService.getOrThrow<string>('REDIS_PORT');
    const password = this._configService.getOrThrow<string>('REDIS_PASSWORD');

    const url = `redis://:${password}@${host}:${port}`;

    this._client = createClient({ url });

    await this._client.connect();
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this._client.get(key);

      if (!data) return null;

      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  public async set<T>(
    key: string,
    value: T,
    ttlSeconds: number = this._defaultTtlSeconds,
  ): Promise<void> {
    const serialized = this._serialize(value);

    await this._client.setEx(key, ttlSeconds, serialized);
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const result = await this._client.del(key);
      return result > 0;
    } catch {
      return false;
    }
  }

  private _serialize<T>(data: T): string {
    if (typeof data === 'string') return data;

    return JSON.stringify(data);
  }

  public async onModuleDestroy() {
    if (this._client) {
      await this._client.quit();
    }
  }
}
