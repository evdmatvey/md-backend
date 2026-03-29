import { ApiProperty } from '@nestjs/swagger';

export class UserNotFoundResponse {
  @ApiProperty({
    required: true,
    example:
      'Пользователь по id "518240ab-3b83-4d99-86c6-fded41de8e23" не найден.',
    description: 'Сообщения, уточняющие почему не был найден пользователь',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'USER_NOT_FOUND',
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

export class UnexpectedRoleActionResponse {
  @ApiProperty({
    required: true,
    example: 'Вы не можете назначить себе новую роль.',
    description: 'Сообщения, уточняющие почему нельзя изменить роль',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'UNEXPECTED_ROLE_ACTION',
    description: 'Тип ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 403,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}
