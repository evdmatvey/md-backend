import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/domains/entities';
import { UserRole } from '@/domains/enums';

export class UserResponse {
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

  public static fromDomain(user: User): UserResponse {
    const { id, username, role, createdAt } = user;

    return {
      id,
      username,
      role,
      createdAt: createdAt.toISOString(),
    };
  }
}
