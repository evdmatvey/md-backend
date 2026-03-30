import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/domains/entities';
import { UserResponse } from '@/modules/user';

export class GetAllAccountsResponse {
  @ApiProperty({
    required: true,
    type: UserResponse,
    isArray: true,
    description: 'Массив пользователей',
  })
  users: UserResponse[];

  public static fromDomain(users: User[]): GetAllAccountsResponse {
    const userResponses = users.map(UserResponse.fromDomain);

    return {
      users: userResponses,
    };
  }
}

export class ChangeRoleResponse {
  @ApiProperty({
    type: UserResponse,
    required: true,
    description: 'Пользователь после обновления роли',
  })
  user: UserResponse;

  @ApiProperty({
    required: true,
    example: 'Вы успешно обновили роль пользователя "username" на "MODERATOR"!',
    description: 'Сообщение указывающее, что роль успешно обновлена',
  })
  message: string;

  public static fromDomain(user: User): ChangeRoleResponse {
    const { username, role } = user;

    return {
      user: UserResponse.fromDomain(user),
      message: `Вы успешно обновили роль пользователя "${username}" на "${role}"!`,
    };
  }
}
