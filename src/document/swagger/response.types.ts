import { ApiProperty } from '@nestjs/swagger';

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
}

export class CreateDocumentOkResponse {
  @ApiProperty({
    required: true,
    example: 'https://md.evdmatvey.ru/doc/843jdea3',
    description:
      'Короткая ссылка, которая ведёт на загруженный пользователем markdown',
  })
  sharedLink: string;
}

export class GetDocumentOkResponse {
  @ApiProperty({
    required: true,
    type: DocumentEntityResponse,
    description: 'Markdown документ',
  })
  document: string;
}

export class DocumentBadRequestResponse {
  @ApiProperty({
    required: true,
    example: ['Название не должно быть пустым.'],
    description:
      'Сообщения, уточняющие какие именно данные были переданы неверно',
  })
  message: string[];

  @ApiProperty({
    required: true,
    example: 'Bad Request',
    description: 'Тип HTTP ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 400,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}

export class DocumentNotFoundResponse {
  @ApiProperty({
    required: true,
    example: 'Документ по slug \"843jdea3\" не найден.',
    description: 'Сообщения, уточняющие почему не был найден документ',
  })
  message: string[];

  @ApiProperty({
    required: true,
    example: 'Not Found',
    description: 'Тип HTTP ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 404,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}
