import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@/domains/enums';
import {
  ChangeUserRoleCommand,
  type ChangeUserRoleUseCase,
  ChangeUserRoleUseCaseSymbol,
  GetUsersQuery,
  type GetUsersUseCase,
  GetUsersUseCaseSymbol,
} from '@/domains/ports/in';
import {
  ApiAuthErrorResponses,
  Auth,
  AuthTokenErrorFilter,
  CurrentUser,
  Roles,
} from '../auth';
import {
  UnexpectedRoleActionResponse,
  UserErrorFilter,
  UserNotFoundResponse,
} from '../user';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { GetAllAccountsDto } from './dto/get-all-accounts.dto';
import {
  ChangeRoleResponse,
  GetAllAccountsResponse,
} from './responses/account-ok.response';

@Controller('accounts')
@Auth()
@UseFilters(AuthTokenErrorFilter, UserErrorFilter)
export class AccountController {
  public constructor(
    @Inject(GetUsersUseCaseSymbol)
    private readonly _getUsersUseCase: GetUsersUseCase,
    @Inject(ChangeUserRoleUseCaseSymbol)
    private readonly _changeUserRoleUseCase: ChangeUserRoleUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получение всех пользователей с возможностью фильтрации',
  })
  @ApiOkResponse({
    type: GetAllAccountsResponse,
    description: 'Пользователи по переданным фильтрам успешно получены',
  })
  @ApiAuthErrorResponses()
  @ApiQuery({
    name: 'username',
    required: false,
  })
  @ApiQuery({
    name: 'role',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    required: false,
  })
  public async getAll(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    dto: GetAllAccountsDto,
  ): Promise<GetAllAccountsResponse> {
    const { username, role, status, createdFrom, createdTo } = dto;
    const query = new GetUsersQuery(
      username,
      role,
      status,
      createdFrom,
      createdTo,
    );
    const users = await this._getUsersUseCase.execute(query);

    return GetAllAccountsResponse.fromDomain(users);
  }

  @Post('/:userId/change-role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Изменение роли пользователя' })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ChangeRoleResponse,
    description: 'Роль успешна изменена',
  })
  @ApiForbiddenResponse({
    type: UnexpectedRoleActionResponse,
    description: 'Вы пытаетесь обновить свою роль',
  })
  @ApiNotFoundResponse({
    type: UserNotFoundResponse,
    description: 'Пользователь которому вы пытаетесь обновить роль не найден',
  })
  @ApiAuthErrorResponses()
  public async changeRole(
    @Param('userId') userId: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: ChangeUserRoleDto,
  ): Promise<ChangeRoleResponse> {
    const { reason, role } = dto;
    const command = new ChangeUserRoleCommand(userId, adminId, reason, role);

    const updatedUser = await this._changeUserRoleUseCase.execute(command);

    return ChangeRoleResponse.fromDomain(updatedUser);
  }
}
