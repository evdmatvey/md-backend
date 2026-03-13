import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, QueryRunner, Repository } from 'typeorm';
import { Document } from '@/domains/entities/document.entity';
import { ModerationActionType } from '@/domains/enums/moderation-action-type.enum';
import {
  DocumentNotFoundError,
  DocumentNotUniqueSlugError,
} from '@/domains/errors/document.error';
import { DocumentRepositoryPort } from '@/domains/ports/out/document-repository.port';
import { DocumentMapper } from './document.mapper';
import { DocumentActionEntity } from './entities/document-action.entity';
import { DocumentEntity } from './entities/document.entity';

@Injectable()
export class DocumentRepository implements DocumentRepositoryPort {
  private static readonly NON_UNIQUE_ERROR_CODE = '23505';

  public constructor(
    @InjectDataSource()
    private readonly _dataSource: DataSource,
    @InjectRepository(DocumentEntity)
    private readonly _documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentActionEntity)
    private readonly _documentActionRepository: Repository<DocumentActionEntity>,
  ) {}

  public async findBySlug(slug: string): Promise<Document | null> {
    const document = await this._documentRepository.findOne({
      where: { slug },
    });

    if (!document) return null;

    return DocumentMapper.mapToDomain(document);
  }

  public async save(document: Document): Promise<Document> {
    if (document.isNew()) {
      return this._create(document);
    } else {
      return this._update(document);
    }
  }

  private async _create(document: Document): Promise<Document> {
    const entity = this._documentRepository.create({
      slug: document.slug,
      title: document.title,
      markdown: document.markdown,
    });

    try {
      await this._documentRepository.save(entity);
      return DocumentMapper.mapToDomain(entity);
    } catch (error) {
      if (this._isNonUniqueFieldError(error))
        throw new DocumentNotUniqueSlugError('');
      throw error;
    }
  }

  private _isNonUniqueFieldError(error: any) {
    return (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { code: string }).code ===
        DocumentRepository.NON_UNIQUE_ERROR_CODE
    );
  }

  private async _update(document: Document): Promise<Document> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const documentRepository =
        queryRunner.manager.getRepository(DocumentEntity);

      const existingEntity = await documentRepository.findOne({
        where: { id: document.id },
      });

      if (!existingEntity) {
        throw new DocumentNotFoundError({ id: document.id });
      }

      existingEntity.slug = document.slug;
      existingEntity.title = document.title;
      existingEntity.markdown = document.markdown;

      if (this._hasNewDocumentAction(document)) {
        await this._saveNewDocumentAction(document, queryRunner);
      }

      const updated = await documentRepository.save(existingEntity);
      await queryRunner.commitTransaction();

      return DocumentMapper.mapToDomain(updated);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private _hasNewDocumentAction(document: Document): boolean {
    const banHistory = document.banHistory;

    if (banHistory.length === 0) return false;

    return banHistory[banHistory.length - 1].isNew();
  }

  private async _saveNewDocumentAction(
    document: Document,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const newAction = document.banHistory.at(-1);

    if (!newAction) return;

    const documentActionRepository =
      queryRunner.manager.getRepository(DocumentActionEntity);

    const action = documentActionRepository.create({
      documentId: document.id,
      adminId: newAction.moderatorId,
      type: newAction.type === ModerationActionType.BAN ? 'ban' : 'unban',
      reason: newAction.reason,
    });

    await documentActionRepository.save(action);
  }
}
