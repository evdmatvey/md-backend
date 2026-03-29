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
