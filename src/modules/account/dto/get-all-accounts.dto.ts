import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole } from '@/domains/enums';
import type { UserStatusFilter } from '@/domains/types';

const toDate = ({ value }: { value: string }): Date | undefined => {
  if (!value) return undefined;

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new BadRequestException(
      `Неверный формат даты. Ожидается ISO 8601 (2026-01-01)`,
    );
  }
  return date;
};

export class GetAllAccountsDto {
  @ApiProperty({
    required: false,
    example: 'username',
    description:
      'Часть имени пользователя по которой будет произведена фильтрация',
  })
  @IsOptional()
  @IsString({ message: 'Имя пользователя должно быть в формате строки.' })
  @MaxLength(24, {
    message: 'Длина имени пользователя не должна быть больше 24 символов.',
  })
  username?: string;

  @ApiProperty({
    required: false,
    enum: UserRole,
    example: UserRole.USER,
    description:
      'Роль пользователя по которой будет произведена фильтрация ("USER"/"MODERATOR"/"ADMIN")',
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Роль пользователя должна быть указана в корректном формате.',
  })
  role?: UserRole;

  @ApiProperty({
    required: false,
    example: 'all',
    description:
      'Статус пользователя по которому будет произведена фильтрация ("all"/"banned"/"active")',
  })
  @IsOptional()
  @IsString({ message: 'Статус пользователя должен быть в формате строки.' })
  @IsIn(['all', 'banned', 'active'], {
    message: 'Статус пользователя должен быть указан в корректном формате.',
  })
  status?: UserStatusFilter;

  @ApiProperty({
    required: false,
    example: '2026-01-01',
    description:
      'Фильтр по дате создания (начало периода). Указываются пользователи, зарегистрировавшиеся не ранее этой даты. Формат: YYYY-MM-DD',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  })
  @IsOptional()
  @Transform(toDate)
  createdFrom?: Date;

  @ApiProperty({
    required: false,
    example: '2026-01-01',
    description:
      'Фильтр по дате создания (конец периода). Указываются пользователи, зарегистрировавшиеся не позднее этой даты. Формат: YYYY-MM-DD',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  })
  @IsOptional()
  @Transform(toDate)
  createdTo?: Date;
}
