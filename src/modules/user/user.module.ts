import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetUsersUseCaseSymbol } from '@/domains/ports/in';
import { UserRepositoryPort } from '@/domains/ports/out';
import { GetUsersService } from '@/domains/services';
import { RedisModule } from '../shared/redis';
import { RoleAssignmentEntity } from './entities/role-assignment.entity';
import { UserBanEntity } from './entities/user-ban.entity';
import { UserEntity } from './entities/user.entity';
import { PasswordHasher } from './libs/password-hasher.lib';
import { UserAgentParser } from './libs/user-agent-parser.lib';
import { UserCache } from './libs/user-cache.lib';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserBanEntity, RoleAssignmentEntity]),
    RedisModule,
  ],
  controllers: [],
  providers: [
    PasswordHasher,
    UserCache,
    UserAgentParser,
    UserRepository,
    {
      provide: GetUsersUseCaseSymbol,
      useClass: GetUsersService,
    },
    {
      provide: GetUsersUseCaseSymbol,
      useFactory: (_usersRepository: UserRepositoryPort) => {
        return new GetUsersService(_usersRepository);
      },
      inject: [UserRepository],
    },
  ],
  exports: [PasswordHasher, UserCache, UserAgentParser, UserRepository],
})
export class UserModule {}
