import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionCache } from './libs/session-cache.lib';
import { TokenHasher } from './libs/token-hasher.lib';
import { TokenService } from './libs/token-service.lib';
import { SessionRepository } from './session.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    JwtModule.registerAsync({
      imports: [ConfigService],
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
  ],
  controllers: [],
  providers: [TokenService, SessionCache, TokenHasher, SessionRepository],
})
export class AuthModule {}
