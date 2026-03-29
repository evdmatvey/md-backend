import {
  Controller,
  Get,
  Inject,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@/domains/enums';
import {
  GetUsersQuery,
  type GetUsersUseCase,
  GetUsersUseCaseSymbol,
} from '@/domains/ports/in';
import {
  ApiAuthErrorResponses,
  Auth,
  AuthTokenErrorFilter,
  Roles,
} from '../auth';
import { GetAllAccountsDto } from './dto/get-all-accounts.dto';
import { GetAllAccountsResponse } from './responses/account-ok.response';

@Controller('accounts')
@Auth()
@UseFilters(AuthTokenErrorFilter)
export class AccountController {
  public constructor(
    @Inject(GetUsersUseCaseSymbol)
    private readonly _getUsersUseCase: GetUsersUseCase,
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
}
