import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  Res,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { type Response } from 'express';
import { SESSION_CONSTANTS } from '@/domains/constants';
import {
  RegisterUserCommand,
  type RegisterUserUseCase,
  RegisterUserUseCaseSymbol,
} from '@/domains/ports/in';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthErrorFilter } from './filters/auth-error.filter';
import {
  AuthBadRequestResponse,
  AuthResultResponse,
  UserAlreadyExistResponse,
} from './responses';

@ApiTags('Авторизация')
@Controller('auth')
@UseFilters(AuthErrorFilter)
@UsePipes(new ValidationPipe())
export class AuthController {
  private REFRESH_TOKEN_NAME: string = 'refreshToken';

  public constructor(
    @Inject(RegisterUserUseCaseSymbol)
    private readonly _registerUserUseCase: RegisterUserUseCase,
    private readonly _configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Регистрация' })
  @ApiCreatedResponse({
    type: AuthResultResponse,
    description: 'Успешная регистрация',
  })
  @ApiBadRequestResponse({
    type: AuthBadRequestResponse,
    description: 'Переданы неверные данные',
  })
  @ApiConflictResponse({
    type: UserAlreadyExistResponse,
    description: 'Пользователь с таким username уже существует',
  })
  @ApiHeader({
    name: 'user-agent',
    required: false,
  })
  public async register(
    @Body() dto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent: string,
  ): Promise<AuthResultResponse> {
    const command = new RegisterUserCommand(
      dto.username,
      dto.password,
      userAgent ?? '',
    );

    const authResult = await this._registerUserUseCase.execute(command);

    this._addRefreshTokenToResponse(res, authResult.tokens.refresh);

    return AuthResultResponse.fromDomain(authResult);
  }

  private _addRefreshTokenToResponse(
    res: Response,
    refreshToken: string,
  ): void {
    const isDev = this._configService.getOrThrow<string>('NODE_ENV');

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this._configService.getOrThrow<string>('APP_HOST'),
      maxAge: SESSION_CONSTANTS.refreshTokenExpiresInMs,
      sameSite: isDev ? 'lax' : 'strict',
      secure: !isDev,
    });
  }

  private _removeRefreshTokenFromResponse(res: Response): void {
    const isDev = this._configService.getOrThrow<string>('NODE_ENV');

    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this._configService.getOrThrow<string>('APP_HOST'),
      maxAge: 0,
      sameSite: isDev ? 'lax' : 'strict',
      secure: !isDev,
    });
  }
}
