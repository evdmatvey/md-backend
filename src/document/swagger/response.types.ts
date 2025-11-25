import { ApiProperty } from '@nestjs/swagger';

export class DocumentOkResponse {
  @ApiProperty({
    required: true,
    example: 'https://md.evdmatvey.ru/doc/843jdea3',
    description:
      'Короткая ссылка, которая ведёт на загруженный пользователем markdown',
  })
  sharedLink: string;
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
