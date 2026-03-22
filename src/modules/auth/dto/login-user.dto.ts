import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsStrongPassword } from '../decorators/is-strong-password.decorator';

export class LoginUserDto {
  @ApiProperty({
    required: true,
    example: 'username',
    description:
      'Имя пользователя, состоящее из 3-24 символов, которое будет использоваться также как логин',
  })
  @IsString({ message: 'Имя пользователя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя пользователя не должно быть пустым.' })
  @MinLength(3, {
    message: 'Длина имени пользователя не может быть меньше 3 символов.',
  })
  @MaxLength(24, {
    message: 'Длина имени пользователя не может быть больше 24 символов.',
  })
  username: string;

  @ApiProperty({
    required: true,
    example: 'Us3rPassw0rd!',
    description:
      'Пароль, состоящий из 8-225 символов, включающий заглавную латинскую букву, спецсимвол и число',
  })
  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым.' })
  @MinLength(8, {
    message: 'Длина пароля не может быть меньше 8 символов.',
  })
  @MaxLength(225, {
    message: 'Длина пароля не может быть больше 225 символов.',
  })
  @IsStrongPassword()
  password: string;
}
