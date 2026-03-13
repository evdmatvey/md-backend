import { Document } from '../entities/document.entity';
import { DocumentNotUniqueSlugError } from '../errors/document.error';
import { CreateDocumentCommand } from '../ports/in/create-document.command';
import { CreateDocumentUseCase } from '../ports/in/create-document.use-case';
import { DocumentRepositoryPort } from '../ports/out/document-repository.port';
import { SlugGeneratorPort } from '../ports/out/slug-generator.port';

export class CreateDocumentService implements CreateDocumentUseCase {
  public constructor(
    private readonly _documentRepository: DocumentRepositoryPort,
    private readonly _slugGenerator: SlugGeneratorPort,
  ) {}

  public async execute(command: CreateDocumentCommand): Promise<Document> {
    while (true) {
      const slug = this._slugGenerator.generate();

      const document = Document.create(slug, command.title, command.markdown);

      try {
        const created = await this._documentRepository.save(document);
        return created;
      } catch (error) {
        if (error instanceof DocumentNotUniqueSlugError) continue;
        throw error;
      }
    }
  }
}
