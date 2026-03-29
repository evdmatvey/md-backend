import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account';
import { AuthModule } from './auth';
import { DocumentModule } from './document';
import { RedisModule } from './shared/redis';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('POSTGRES_HOST'),
        port: +config.getOrThrow<string>('POSTGRES_PORT'),
        username: config.getOrThrow<string>('POSTGRES_USER'),
        password: config.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: config.getOrThrow<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: config.getOrThrow('NODE_ENV') !== 'production',
      }),
    }),
    DocumentModule,
    RedisModule,
    AuthModule,
    UserModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
