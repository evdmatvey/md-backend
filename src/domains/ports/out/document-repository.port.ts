import { Document } from '../../entities/document.entity';

export interface DocumentRepositoryPort {
  save(document: Document): Promise<Document>;
  findBySlug(slug: string): Promise<Document | null>;
}
