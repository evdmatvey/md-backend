import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { QueryFailedError, Repository } from 'typeorm';
import { DocumentService } from '@/document/document.service';
import { CreateDocumentDto } from '@/document/dto/create-document.dto';
import { DocumentEntity } from '@/document/entities/document.entity';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

describe('DocumentService', () => {
  let service: DocumentService;
  let repo: Partial<Record<keyof Repository<DocumentEntity>, jest.Mock>>;
  let configService: Partial<ConfigService>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'APP_HOST') return 'localhost:4200';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: repo,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Create document and return valid sharedLink', async () => {
    const dto: CreateDocumentDto = {
      title: 'title',
      markdown: 'document',
    } as any;

    const mockedNanoid = nanoid as jest.Mock;
    mockedNanoid.mockReturnValueOnce('3j4ejedf');

    (repo.create as jest.Mock).mockImplementation((data) => ({
      id: 1,
      ...data,
    }));

    (repo.save as jest.Mock).mockImplementation(async (entity) => ({
      ...entity,
    }));

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(repo.create).toHaveBeenCalledWith({ ...dto, slug: '3j4ejedf' });

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      sharedLink: 'https://localhost:4200/doc/3j4ejedf',
    });
  });

  it('Retry slug generation on conflict and return new slug', async () => {
    const dto: CreateDocumentDto = {
      title: 'title',
      markdown: 'document',
    };
    const mockedNanoid = nanoid as jest.Mock;
    mockedNanoid
      .mockReturnValueOnce('conflict1')
      .mockReturnValueOnce('okslug2');

    (repo.create as jest.Mock).mockImplementation((data) => ({ ...data }));

    const firstError = new QueryFailedError(
      'INSERT ...',
      [],
      new Error('Non-unique slug'),
    );
    (firstError as any).code = '23505';

    (repo.save as jest.Mock)
      .mockImplementationOnce(async () => {
        throw firstError;
      })
      .mockImplementationOnce(async (entity) => ({ ...entity }));

    const result = await service.create(dto);

    expect(mockedNanoid).toHaveBeenCalledTimes(2);
    expect(repo.create).toHaveBeenCalledTimes(2);
    expect(repo.create).toHaveBeenNthCalledWith(1, {
      ...dto,
      slug: 'conflict1',
    });
    expect(repo.create).toHaveBeenNthCalledWith(2, { ...dto, slug: 'okslug2' });

    expect(repo.save).toHaveBeenCalledTimes(2);

    expect(result).toEqual({
      sharedLink: 'https://localhost:4200/doc/okslug2',
    });
  });
});
