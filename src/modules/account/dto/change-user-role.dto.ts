import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserRole } from '@/domains/enums';

export class ChangeUserRoleDto {
  @ApiProperty({
    required: true,
    example: 'Причина назначения новой роли',
    description:
      'Причина повышения или понижения роли пользователя, которая потом будет отображена в истории изменения его ролей',
  })
  @IsString({
    message: 'Причина изменения роли пользователя должна быть строкой.',
  })
  @IsNotEmpty({
    message: 'Причина изменения роли пользователя не должна быть пустой.',
  })
  @MaxLength(400, {
    message:
      'Причина изменения роли пользователя должна быть не более 400 символов в длину.',
  })
  reason: string;

  @ApiProperty({
    required: true,
    example: UserRole.MODERATOR,
    enum: UserRole,
    description: 'Роль которую хотите назначить',
  })
  @IsEnum(UserRole, {
    message: 'Роль пользователя должна быть передана в корректном формате.',
  })
  role: UserRole;
}
