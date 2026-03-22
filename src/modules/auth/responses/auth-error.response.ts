import { ApiProperty } from '@nestjs/swagger';

export class AuthBadRequestResponse {
  @ApiProperty({
    required: true,
    example: [
      'Имя пользователя не должно быть пустым.',
      'Пароль не должен быть пустым.',
    ],
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

export class UserAlreadyExistResponse {
  @ApiProperty({
    required: true,
    example: 'Пользователь с именем username уже существует.',
    description: 'Сообщение описывающее ошибку',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'USER_ALREADY_EXIST',
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

export class UserPasswordMismatchResponse {
  @ApiProperty({
    required: true,
    example: 'Неверный логин или пароль.',
    description: 'Сообщение описывающее ошибку',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'INCORRECT_LOGIN_OR_PASSWORD',
    description: 'Тип ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 401,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}

export class UserNotFoundResponse {
  @ApiProperty({
    required: true,
    example: 'Пользователь по имени "username" не найден.',
    description: 'Сообщение описывающее ошибку',
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

export class UserBannedResponse {
  @ApiProperty({
    required: true,
    example: 'Пользователь "username" заблокирован.',
    description: 'Сообщение описывающее ошибку',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'USER_BANNED',
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

export class SessionNotFoundResponse {
  @ApiProperty({
    required: true,
    example: 'Сессия не найдена по id dcc3dcf2-11a5-46d4-9644-742a95aad2b3.',
    description: 'Сообщение описывающее ошибку',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'SESSION_NOT_FOUND',
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

export class SessionMismatchResponse {
  @ApiProperty({
    required: true,
    example: 'Сессия не совпадает с полученными данными.',
    description: 'Сообщение описывающее ошибку',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'SESSION_MISMATCH',
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

export class SessionExpiredResponse {
  @ApiProperty({
    required: true,
    example: 'Текущая сессия уже истекла.',
    description: 'Сообщение описывающее ошибку',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'SESSION_EXPIRED',
    description: 'Тип ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 401,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}

export class SessionTokensMismatchResponse {
  @ApiProperty({
    required: true,
    example: 'Токен не совпал с токеном сессии.',
    description: 'Сообщение описывающее ошибку',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'SESSION_TOKENS_MISMATCH',
    description: 'Тип ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 401,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}

export class SessionTokenResponse {
  @ApiProperty({
    required: true,
    example: 'Передан невалидный токен.',
    description: 'Сообщение описывающее ошибку',
  })
  message: string;

  @ApiProperty({
    required: true,
    example: 'INVALID_TOKEN',
    description: 'Тип ошибки в строковом виде',
  })
  error: string;

  @ApiProperty({
    required: true,
    example: 401,
    description: 'Тип HTTP ошибки в виде кода',
  })
  statusCode: number;
}
