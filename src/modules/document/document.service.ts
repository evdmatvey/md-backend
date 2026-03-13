import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { QueryFailedError, Repository } from 'typeorm';
import { RedisService } from '@/modules/redis/redis.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentEntity } from './entities/document.entity';

@Injectable()
export class DocumentService {
  private static readonly SLUG_LENGTH = 8;
  private static readonly NON_UNIQUE_ERROR_CODE = '23505';

  public constructor(
    @InjectRepository(DocumentEntity)
    private readonly _documentRepository: Repository<DocumentEntity>,
    private readonly _configService: ConfigService,
    private readonly _redisService: RedisService,
  ) {}

  public async getBySlug(slug: string): Promise<DocumentEntity> {
    const cachedKey = `document:${slug}`;
    const cached = await this._redisService.get<DocumentEntity>(cachedKey);

    if (cached) {
      return cached;
    }

    const document = await this._documentRepository.findOne({
      where: {
        slug,
      },
    });

    if (!document)
      throw new NotFoundException(`Документ по slug \"${slug}\" не найден.`);

    await this._redisService.set(cachedKey, document);

    return document;
  }

  public async create(dto: CreateDocumentDto): Promise<{ sharedLink: string }> {
    while (true) {
      const slug = nanoid(DocumentService.SLUG_LENGTH);

      const document = this._documentRepository.create({
        ...dto,
        slug,
      });

      try {
        await this._documentRepository.save(document);
      } catch (error) {
        if (this._isNonUniqueSlugGenerated(error)) continue;
        throw error;
      }

      const sharedLink = this._makeSharedLinkBySlug(slug);

      return { sharedLink };
    }
  }

  private _isNonUniqueSlugGenerated(error: any) {
    return (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { code: string }).code ===
        DocumentService.NON_UNIQUE_ERROR_CODE
    );
  }

  private _makeSharedLinkBySlug(slug: string): string {
    const frontendUrl = this._configService.getOrThrow<string>('FRONTEND_URL');
    const baseUrl = frontendUrl.replace(/\/$/, '');

    return `${baseUrl}/doc/${slug}`;
  }
}
