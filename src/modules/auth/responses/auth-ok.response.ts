import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@/domains/enums';
import { AuthResult } from '@/domains/types';

class UserResponse {
  @ApiProperty({
    required: true,
    example: 'dcc3dcf2-11a5-46d4-9644-742a95aad2b3',
    description: 'Идентификатор пользователя',
  })
  id: string;

  @ApiProperty({
    required: true,
    example: 'username',
    description: 'Имя пользователя',
  })
  username: string;

  @ApiProperty({
    required: true,
    example: 'USER',
    description: 'Роль пользователя',
  })
  role: UserRole;

  @ApiProperty({
    required: true,
    example: '2025-11-25T06:00:36.138Z',
    description: 'Дата и время регистрации',
  })
  createdAt: string;
}

export class AuthResultResponse {
  @ApiProperty({
    required: true,
    type: UserResponse,
    description: 'Данные пользователя',
  })
  user: UserResponse;

  @ApiProperty({
    required: true,
    example: 'access-token',
    description: 'Access токен пользователя',
  })
  accessToken: string;

  public static fromDomain(authResult: AuthResult): AuthResultResponse {
    const { id, username, role, createdAt } = authResult.user;

    return {
      user: {
        id,
        username,
        role,
        createdAt: createdAt.toISOString(),
      },
      accessToken: authResult.tokens.access,
    };
  }
}
