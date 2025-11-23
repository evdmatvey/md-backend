import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentEntity } from './entities/document.entity';

@Injectable()
export class DocumentService {
  private static readonly SLUG_LENGTH = 8;
  private static readonly NON_UNIQUE_ERROR_CODE = '23505';

  public constructor(
    @InjectRepository(DocumentEntity)
    private readonly _documentRepository: Repository<DocumentEntity>,
  ) {}

  public async create(dto: CreateDocumentDto): Promise<DocumentEntity> {
    while (true) {
      const slug = nanoid(DocumentService.SLUG_LENGTH);

      const document = this._documentRepository.create({
        ...dto,
        slug,
      });

      try {
        return this._documentRepository.save(document);
      } catch (error) {
        if (this._isNonUniqueSlugGenerated(error)) continue;
        throw error;
      }
    }
  }

  private _isNonUniqueSlugGenerated(error: any) {
    return (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { code: string }).code ===
        DocumentService.NON_UNIQUE_ERROR_CODE
    );
  }
}
