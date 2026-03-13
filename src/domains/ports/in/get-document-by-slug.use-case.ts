import { Document } from '@/domains/entities/document.entity';
import { GetDocumentBySlugQuery } from './get-document-by-slug.query';

export const GetDocumentBySlugUseCaseSymbol = Symbol(
  'GetDocumentBySlugUseCaseSymbol',
);

export interface GetDocumentBySlugUseCase {
  execute(query: GetDocumentBySlugQuery): Promise<Document>;
}
