import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  providers: [PasswordHasher, UserCache, UserAgentParser, UserRepository],
  exports: [PasswordHasher, UserCache, UserAgentParser, UserRepository],
})
export class UserModule {}
