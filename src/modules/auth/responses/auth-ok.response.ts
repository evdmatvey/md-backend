import { ApiProperty } from '@nestjs/swagger';
import { AuthResult } from '@/domains/types';
import { UserResponse } from '@/modules/user';

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
    const { tokens, user } = authResult;

    return {
      user: UserResponse.fromDomain(user),
      accessToken: tokens.access,
    };
  }
}
