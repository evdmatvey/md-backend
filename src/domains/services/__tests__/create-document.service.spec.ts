import { NEW_ID } from '@/domains/constants';
import { Document } from '@/domains/entities/document.entity';
import { DocumentNotUniqueSlugError } from '@/domains/errors/document.error';
import { CreateDocumentCommand } from '@/domains/ports/in/create-document.command';
import { DocumentRepositoryPort } from '@/domains/ports/out/document-repository.port';
import { SlugGeneratorPort } from '@/domains/ports/out/slug-generator.port';
import { CreateDocumentService } from '../create-document.service';

describe('CreateDocumentService', () => {
  let documentRepository: jest.Mocked<DocumentRepositoryPort>;
  let slugGenerator: jest.Mocked<SlugGeneratorPort>;
  let createDocumentService: CreateDocumentService;

  beforeEach(() => {
    documentRepository = {
      findBySlug: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<DocumentRepositoryPort>;
    slugGenerator = {
      generate: jest.fn(),
    } as jest.Mocked<SlugGeneratorPort>;
    createDocumentService = new CreateDocumentService(
      documentRepository,
      slugGenerator,
    );
  });

  it('Should create document', async () => {
    const slug = '123456';
    const title = 'Title';
    const markdown = '#Markdown';

    slugGenerator.generate.mockReturnValue(slug);

    const command = new CreateDocumentCommand(title, markdown);
    await createDocumentService.execute(command);

    expect(documentRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: NEW_ID,
        slug: slug,
        title: title,
        markdown: markdown,
      }),
    );
  });

  it('Should regenerate slug when slug is not unique', async () => {
    const firstSlug = '123456';
    const secondSlug = '789012';
    const thirdSlug = '345678';
    const title = 'Title';
    const markdown = '#Markdown';

    slugGenerator.generate
      .mockReturnValueOnce(firstSlug)
      .mockReturnValueOnce(secondSlug)
      .mockReturnValueOnce(thirdSlug);

    documentRepository.save
      .mockRejectedValueOnce(new DocumentNotUniqueSlugError(''))
      .mockRejectedValueOnce(new DocumentNotUniqueSlugError(''))
      .mockResolvedValueOnce(Document.create(thirdSlug, title, markdown));

    const command = new CreateDocumentCommand(title, markdown);

    await createDocumentService.execute(command);

    expect(slugGenerator.generate).toHaveBeenCalledTimes(3);
    expect(documentRepository.save).toHaveBeenCalledTimes(3);
    expect(documentRepository.save).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ slug: firstSlug }),
    );
    expect(documentRepository.save).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ slug: secondSlug }),
    );
    expect(documentRepository.save).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ slug: thirdSlug }),
    );
  });
});
