import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsPasswordsMatching } from '../decorators/is-passwords-matching.decorator';
import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto extends LoginUserDto {
  @ApiProperty({
    required: true,
    example: 'Us3rPassw0rd!',
    description: 'Пароль введенный повторно',
  })
  @IsString({ message: 'Повторение пароля должно быть строкой.' })
  @IsNotEmpty({ message: 'Повторение пароля не должно быть пустым.' })
  @IsPasswordsMatching()
  passwordRepeat: string;
}
