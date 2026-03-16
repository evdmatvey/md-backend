import { Document } from '@/domains/entities';

export interface DocumentCachePort {
  get(slug: string): Promise<Document | null>;
  set(slug: string, document: Document): Promise<void>;
}
