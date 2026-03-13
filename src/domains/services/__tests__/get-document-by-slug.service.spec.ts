import { Document } from '@/domains/entities/document.entity';
import { DocumentNotFoundError } from '@/domains/errors/document.error';
import { GetDocumentBySlugQuery } from '@/domains/ports/in/get-document-by-slug.query';
import { DocumentCachePort } from '@/domains/ports/out/document-cache.port';
import { DocumentRepositoryPort } from '@/domains/ports/out/document-repository.port';
import { GetDocumentBySlugService } from '../get-document-by-slug.service';

describe('GetDocumentBySlugService', () => {
  let documentRepository: jest.Mocked<DocumentRepositoryPort>;
  let documentCache: jest.Mocked<DocumentCachePort>;
  let getDocumentBySlugService: GetDocumentBySlugService;

  beforeEach(() => {
    documentRepository = {
      findBySlug: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<DocumentRepositoryPort>;

    documentCache = {
      get: jest.fn(),
      set: jest.fn(),
    } as jest.Mocked<DocumentCachePort>;

    getDocumentBySlugService = new GetDocumentBySlugService(
      documentRepository,
      documentCache,
    );
  });

  it('Should return cached document when it exists in cache', async () => {
    const slug = '123456';
    const cachedDocument = Document.create(slug, 'Title', '#Markdown');

    documentCache.get.mockResolvedValue(cachedDocument);

    const query = new GetDocumentBySlugQuery(slug);
    const result = await getDocumentBySlugService.execute(query);

    expect(documentCache.get).toHaveBeenCalledWith(slug);
    expect(documentRepository.findBySlug).not.toHaveBeenCalled();
    expect(documentCache.set).not.toHaveBeenCalled();
    expect(result).toEqual(cachedDocument);
  });

  it('Should fetch from repository and cache when document not in cache', async () => {
    const slug = '123456';
    const document = Document.create(slug, 'Title', '#Markdown');

    documentCache.get.mockResolvedValue(null);
    documentRepository.findBySlug.mockResolvedValue(document);

    const query = new GetDocumentBySlugQuery(slug);
    const result = await getDocumentBySlugService.execute(query);

    expect(documentCache.get).toHaveBeenCalledWith(slug);
    expect(documentRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(documentCache.set).toHaveBeenCalledWith(slug, document);
    expect(result).toEqual(document);
  });

  it('Should throw DocumentNotFoundError when document not found in repository', async () => {
    const slug = '123456';

    documentCache.get.mockResolvedValue(null);
    documentRepository.findBySlug.mockResolvedValue(null);

    const query = new GetDocumentBySlugQuery(slug);

    await expect(getDocumentBySlugService.execute(query)).rejects.toThrow(
      DocumentNotFoundError,
    );

    expect(documentCache.get).toHaveBeenCalledWith(slug);
    expect(documentRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(documentCache.set).not.toHaveBeenCalled();
  });

  it('Should handle repository errors', async () => {
    const slug = '123456';
    const error = new Error('Database error');

    documentCache.get.mockResolvedValue(null);
    documentRepository.findBySlug.mockRejectedValue(error);

    const query = new GetDocumentBySlugQuery(slug);

    await expect(getDocumentBySlugService.execute(query)).rejects.toThrow(
      error,
    );

    expect(documentCache.get).toHaveBeenCalledWith(slug);
    expect(documentRepository.findBySlug).toHaveBeenCalledWith(slug);
    expect(documentCache.set).not.toHaveBeenCalled();
  });
});
