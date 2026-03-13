import { Document } from '@/domains/entities/document.entity';

export interface DocumentCachePort {
  get(slug: string): Promise<Document | null>;
  set(slug: string, document: Document): Promise<void>;
}
