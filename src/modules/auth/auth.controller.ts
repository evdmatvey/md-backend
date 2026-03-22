import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  Req,
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
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type Request, type Response } from 'express';
import { SESSION_CONSTANTS } from '@/domains/constants';
import { SessionTokenError } from '@/domains/errors';
import {
  ExtendSessionCommand,
  type ExtendSessionUseCase,
  ExtendSessionUseCaseSymbol,
  LoginUserCommand,
  type LoginUserUseCase,
  LoginUserUseCaseSymbol,
  RegisterUserCommand,
  type RegisterUserUseCase,
  RegisterUserUseCaseSymbol,
} from '@/domains/ports/in';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthErrorFilter } from './filters/auth-error.filter';
import {
  AuthBadRequestResponse,
  AuthResultResponse,
  SessionExpiredResponse,
  SessionMismatchResponse,
  SessionNotFoundResponse,
  UserAlreadyExistResponse,
  UserBannedResponse,
  UserNotFoundResponse,
  UserPasswordMismatchResponse,
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
    @Inject(LoginUserUseCaseSymbol)
    private readonly _loginUserUseCase: LoginUserUseCase,
    @Inject(ExtendSessionUseCaseSymbol)
    private readonly _extendSessionUseCase: ExtendSessionUseCase,
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

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Вход в аккаунт' })
  @ApiOkResponse({
    type: AuthResultResponse,
    description: 'Успешный вход в аккаунт',
  })
  @ApiBadRequestResponse({
    type: AuthBadRequestResponse,
    description: 'Переданы неверные данные',
  })
  @ApiUnauthorizedResponse({
    type: UserPasswordMismatchResponse,
    description: 'Передан неверный пароль от аккаунта',
  })
  @ApiForbiddenResponse({
    type: UserBannedResponse,
    description: 'Попытка входа в заблокированный аккаунт',
  })
  @ApiNotFoundResponse({
    type: UserNotFoundResponse,
    description: 'Пользователь с переданным username не найден',
  })
  @ApiHeader({
    name: 'user-agent',
    required: false,
  })
  public async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('user-agent') userAgent: string,
  ): Promise<AuthResultResponse> {
    const command = new LoginUserCommand(
      dto.username,
      dto.password,
      userAgent ?? '',
    );

    const authResult = await this._loginUserUseCase.execute(command);

    this._addRefreshTokenToResponse(res, authResult.tokens.refresh);

    return AuthResultResponse.fromDomain(authResult);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Продление сессии по refresh токену' })
  @ApiOkResponse({
    type: AuthResultResponse,
    description: 'Сессия успешно продлена',
  })
  @ApiUnauthorizedResponse({
    type: SessionExpiredResponse,
    description: 'Сессия истекла',
  })
  @ApiForbiddenResponse({
    type: SessionMismatchResponse,
    description: 'userId из сессии и из токена не совпадают',
  })
  @ApiNotFoundResponse({
    type: SessionNotFoundResponse,
    description: 'Сессия не найдена по sessionId из токена',
  })
  public async extendSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResultResponse> {
    const refreshToken = this._getRefreshTokenFromRequest(req, res);
    const command = new ExtendSessionCommand(refreshToken);

    const authResult = await this._extendSessionUseCase.execute(command);

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

  private _getRefreshTokenFromRequest(req: Request, res: Response): string {
    const refreshTokenFromCookies = req.cookies[this.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookies) {
      this._removeRefreshTokenFromResponse(res);
      throw new SessionTokenError();
    }

    return refreshTokenFromCookies;
  }
}
