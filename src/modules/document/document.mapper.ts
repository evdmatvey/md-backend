import { Document } from '@/domains/entities/document.entity';
import { ModerationActionHistory } from '@/domains/entities/moderation-action-history.entity';
import { DocumentEntity } from './entities/document.entity';

export class DocumentMapper {
  public static mapToDomain(entity: DocumentEntity): Document {
    const { id, slug, title, markdown, createdAt } = entity;
    const banHistory = new ModerationActionHistory([]);

    return new Document(id, slug, title, markdown, createdAt, banHistory);
  }
}
