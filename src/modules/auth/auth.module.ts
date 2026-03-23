import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ExtendSessionUseCaseSymbol,
  LoginUserUseCaseSymbol,
  LogoutUserUseCaseSymbol,
  RegisterUserUseCaseSymbol,
} from '@/domains/ports/in';
import {
  ExtendSessionService,
  LoginUserService,
  LogoutUserService,
  RegisterUserService,
} from '@/domains/services';
import { RedisModule } from '../shared/redis';
import {
  PasswordHasher,
  UserAgentParser,
  UserCache,
  UserModule,
  UserRepository,
} from '../user';
import { AuthController } from './auth.controller';
import { SessionEntity } from './entities/session.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { SessionCache } from './libs/session-cache.lib';
import { TokenHasher } from './libs/token-hasher.lib';
import { TokenService } from './libs/token-service.lib';
import { SessionRepository } from './session.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          issuer: configService.getOrThrow<string>('JWT_TOKEN_ISSUER'),
        },
        verifyOptions: {
          issuer: configService.getOrThrow<string>('JWT_TOKEN_ISSUER'),
        },
      }),
    }),
    ConfigModule,
    UserModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    TokenService,
    SessionCache,
    TokenHasher,
    SessionRepository,
    JwtAuthGuard,
    RoleGuard,
    {
      provide: RegisterUserUseCaseSymbol,
      useClass: RegisterUserService,
    },
    {
      provide: RegisterUserUseCaseSymbol,
      useFactory: (
        _tokenService: TokenService,
        _userRepository: UserRepository,
        _sessionRepository: SessionRepository,
        _passwordHasher: PasswordHasher,
        _tokenHasher: TokenHasher,
        _userAgentParser: UserAgentParser,
        _userCache: UserCache,
        _sessionCache: SessionCache,
      ) => {
        return new RegisterUserService(
          _tokenService,
          _userRepository,
          _sessionRepository,
          _passwordHasher,
          _tokenHasher,
          _userAgentParser,
          _userCache,
          _sessionCache,
        );
      },
      inject: [
        TokenService,
        UserRepository,
        SessionRepository,
        PasswordHasher,
        TokenHasher,
        UserAgentParser,
        UserCache,
        SessionCache,
      ],
    },
    {
      provide: LoginUserUseCaseSymbol,
      useClass: LoginUserService,
    },
    {
      provide: LoginUserUseCaseSymbol,
      useFactory: (
        _tokenService: TokenService,
        _userRepository: UserRepository,
        _sessionRepository: SessionRepository,
        _passwordHasher: PasswordHasher,
        _tokenHasher: TokenHasher,
        _userAgentParser: UserAgentParser,
        _userCache: UserCache,
        _sessionCache: SessionCache,
      ) => {
        return new LoginUserService(
          _tokenService,
          _userRepository,
          _sessionRepository,
          _passwordHasher,
          _tokenHasher,
          _userAgentParser,
          _userCache,
          _sessionCache,
        );
      },
      inject: [
        TokenService,
        UserRepository,
        SessionRepository,
        PasswordHasher,
        TokenHasher,
        UserAgentParser,
        UserCache,
        SessionCache,
      ],
    },
    {
      provide: ExtendSessionUseCaseSymbol,
      useClass: ExtendSessionService,
    },
    {
      provide: ExtendSessionUseCaseSymbol,
      useFactory: (
        _tokenService,
        _userRepository,
        _sessionRepository,
        _tokenHasher,
        _userCache,
        _sessionCache,
      ) => {
        return new ExtendSessionService(
          _tokenService,
          _userRepository,
          _sessionRepository,
          _tokenHasher,
          _sessionCache,
          _userCache,
        );
      },
      inject: [
        TokenService,
        UserRepository,
        SessionRepository,
        TokenHasher,
        UserCache,
        SessionCache,
      ],
    },
    {
      provide: LogoutUserUseCaseSymbol,
      useClass: LogoutUserService,
    },
    {
      provide: LogoutUserUseCaseSymbol,
      useFactory: (_tokenService, _sessionRepository, _sessionCache) => {
        return new LogoutUserService(
          _tokenService,
          _sessionRepository,
          _sessionCache,
        );
      },
      inject: [TokenService, SessionRepository, SessionCache],
    },
  ],
  exports: [JwtAuthGuard, RoleGuard],
})
export class AuthModule {}
