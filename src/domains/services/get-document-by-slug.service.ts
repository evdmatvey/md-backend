import { Document } from '../entities/document.entity';
import {
  DocumentBannedError,
  DocumentNotFoundError,
} from '../errors/document.error';
import { GetDocumentBySlugQuery } from '../ports/in/get-document-by-slug.query';
import { GetDocumentBySlugUseCase } from '../ports/in/get-document-by-slug.use-case';
import { DocumentCachePort } from '../ports/out/document-cache.port';
import { DocumentRepositoryPort } from '../ports/out/document-repository.port';

export class GetDocumentBySlugService implements GetDocumentBySlugUseCase {
  public constructor(
    private readonly _documentRepository: DocumentRepositoryPort,
    private readonly _documentCache: DocumentCachePort,
  ) {}

  public async execute(query: GetDocumentBySlugQuery): Promise<Document> {
    const { slug } = query;
    const cached = await this._documentCache.get(slug);

    if (cached) {
      return cached;
    }

    const document = await this._documentRepository.findBySlug(slug);

    if (!document) throw new DocumentNotFoundError({ slug });

    if (document.isBanned)
      throw new DocumentBannedError(
        slug,
        document.currentBan!.reason,
        document.currentBan!.occurredAt,
      );

    await this._documentCache.set(slug, document);

    return document;
  }
}
