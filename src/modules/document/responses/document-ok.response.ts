import { ApiProperty } from '@nestjs/swagger';
import { Document } from '@/domains/entities/document.entity';

export class DocumentEntityResponse {
  @ApiProperty({
    required: true,
    example: 'dcc3dcf2-11a5-46d4-9644-742a95aad2b3',
    description: 'Идентификатор документа',
  })
  id: string;

  @ApiProperty({
    required: true,
    example: 'Title',
    description: 'Название документа',
  })
  title: string;

  @ApiProperty({
    required: true,
    example: '## Markdown code',
    description: 'Текст в формате markdown',
  })
  markdown: string;

  @ApiProperty({
    required: true,
    example: '843jdea3',
    description: 'Короткий идентификатор документа',
  })
  slug: string;

  @ApiProperty({
    required: true,
    example: '2025-11-25T06:00:36.138Z',
    description: 'Дата создания в ISO формате',
  })
  createdAt: string;

  public static fromDomain(document: Document): DocumentEntityResponse {
    const { id, title, markdown, slug, createdAt } = document;

    return {
      id,
      title,
      markdown,
      slug,
      createdAt: createdAt.toISOString(),
    };
  }
}

export class CreateDocumentOkResponse {
  @ApiProperty({
    required: true,
    example: 'https://md.evdmatvey.ru/doc/843jdea3',
    description:
      'Короткая ссылка, которая ведёт на загруженный пользователем markdown',
  })
  sharedLink: string;

  public static fromDomain(
    document: Document,
    sharedUrl: string,
  ): CreateDocumentOkResponse {
    return {
      sharedLink: `${sharedUrl}/doc/${document.slug}`,
    };
  }
}

export class GetDocumentOkResponse {
  @ApiProperty({
    required: true,
    type: DocumentEntityResponse,
    description: 'Markdown документ',
  })
  document: DocumentEntityResponse;

  public static fromDomain(document: Document): GetDocumentOkResponse {
    return {
      document: DocumentEntityResponse.fromDomain(document),
    };
  }
}
