import { Injectable } from '@nestjs/common';
import { Document } from '@/domains/entities/document.entity';
import { DocumentCachePort } from '@/domains/ports/out/document-cache.port';
import { RedisService } from '@/modules/redis/redis.service';

@Injectable()
export class DocumentCache implements DocumentCachePort {
  public constructor(private readonly _redisService: RedisService) {}

  public async get(slug: string): Promise<Document | null> {
    const key = this._getKeyBySlug(slug);

    return this._redisService.get<Document>(key);
  }

  public async set(slug: string, document: Document): Promise<void> {
    const key = this._getKeyBySlug(slug);

    await this._redisService.set<Document>(key, document);
  }

  private _getKeyBySlug(slug: string): string {
    return `document:${slug}`;
  }
}
