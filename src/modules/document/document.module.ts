import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateDocumentUseCaseSymbol } from '@/domains/ports/in/create-document.use-case';
import { GetDocumentBySlugUseCaseSymbol } from '@/domains/ports/in/get-document-by-slug.use-case';
import { CreateDocumentService } from '@/domains/services/create-document.service';
import { GetDocumentBySlugService } from '@/domains/services/get-document-by-slug.service';
import { RedisModule } from '@/modules/redis/redis.module';
import { RedisService } from '@/modules/redis/redis.service';
import { DocumentController } from './document.controller';
import { DocumentRepository } from './document.repository';
import { DocumentActionEntity } from './entities/document-action.entity';
import { DocumentEntity } from './entities/document.entity';
import { DocumentCache } from './libs/document-cache.lib';
import { SlugGenerator } from './libs/slug-generator.lib';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, DocumentActionEntity]),
    ConfigModule,
    RedisModule,
  ],
  controllers: [DocumentController],
  providers: [
    DocumentRepository,
    RedisService,
    DocumentCache,
    SlugGenerator,
    {
      provide: CreateDocumentUseCaseSymbol,
      useClass: CreateDocumentService,
    },
    {
      provide: CreateDocumentUseCaseSymbol,
      useFactory: (
        _documentRepository: DocumentRepository,
        _slugGenerator: SlugGenerator,
      ) => {
        return new CreateDocumentService(_documentRepository, _slugGenerator);
      },
      inject: [DocumentRepository, SlugGenerator],
    },
    {
      provide: GetDocumentBySlugUseCaseSymbol,
      useClass: GetDocumentBySlugService,
    },
    {
      provide: GetDocumentBySlugUseCaseSymbol,
      useFactory: (
        _documentRepository: DocumentRepository,
        _documentCache: DocumentCache,
      ) => {
        return new GetDocumentBySlugService(
          _documentRepository,
          _documentCache,
        );
      },
      inject: [DocumentRepository, DocumentCache],
    },
  ],
})
export class DocumentModule {}
