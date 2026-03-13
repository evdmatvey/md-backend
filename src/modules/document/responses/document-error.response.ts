import { ApiProperty } from '@nestjs/swagger';

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
    example: 'DOCUMENT_NOT_FOUND',
    description: 'Тип ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 404,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}

export class DocumentBannedResponse {
  @ApiProperty({
    required: true,
    example: 'Документ \"843jdea3\" заблокирован.',
    description: 'Сообщения, уточняющие что документ заблокирован',
  })
  message: string[];

  @ApiProperty({
    required: true,
    example: 'DOCUMENT_BANNED',
    description: 'Тип ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 403,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;

  @ApiProperty({
    required: true,
    example: 'Нарушение правил платформы',
    description: 'Причина блокировки',
  })
  reason: string;

  @ApiProperty({
    required: true,
    example: '2025-11-25T06:00:36.138Z',
    description: 'Дата блокировки',
  })
  occurredAt: Date;
}

export class DocumentUnexpectedActionResponse {
  @ApiProperty({
    required: true,
    example: 'Документ уже заблокирован.',
    description: 'Сообщения, уточняющие почему нельзя выполнить действие',
  })
  message: string[];

  @ApiProperty({
    required: true,
    example: 'DOCUMENT_UNEXPECTED_ACTION',
    description: 'Тип ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 409,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}
