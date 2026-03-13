import { Document } from '@/domains/entities/document.entity';
import { CreateDocumentCommand } from './create-document.command';

export const CreateDocumentUseCaseSymbol = Symbol(
  'CreateDocumentUseCaseSymbol',
);

export interface CreateDocumentUseCase {
  execute(command: CreateDocumentCommand): Promise<Document>;
}
