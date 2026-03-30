import { Module } from '@nestjs/common';
import {
  ChangeUserRoleUseCaseSymbol,
  GetUsersUseCaseSymbol,
} from '@/domains/ports/in';
import type { UserCachePort, UserRepositoryPort } from '@/domains/ports/out';
import { ChangeUserRoleService, GetUsersService } from '@/domains/services';
import { AuthModule } from '../auth';
import { UserCache, UserModule, UserRepository } from '../user';
import { AccountController } from './account.controller';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AccountController],
  providers: [
    {
      provide: GetUsersUseCaseSymbol,
      useClass: GetUsersService,
    },
    {
      provide: GetUsersUseCaseSymbol,
      useFactory: (_userRepository: UserRepositoryPort) => {
        return new GetUsersService(_userRepository);
      },
      inject: [UserRepository],
    },
    {
      provide: ChangeUserRoleUseCaseSymbol,
      useClass: ChangeUserRoleService,
    },
    {
      provide: ChangeUserRoleUseCaseSymbol,
      useFactory: (
        _userRepository: UserRepositoryPort,
        _userCache: UserCachePort,
      ) => {
        return new ChangeUserRoleService(_userRepository, _userCache);
      },
      inject: [UserRepository, UserCache],
    },
  ],
})
export class AccountModule {}
