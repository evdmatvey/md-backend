import { Module } from '@nestjs/common';
import { GetUsersUseCaseSymbol } from '@/domains/ports/in';
import { UserRepositoryPort } from '@/domains/ports/out';
import { GetUsersService } from '@/domains/services';
import { AuthModule } from '../auth';
import { UserModule, UserRepository } from '../user';
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
      useFactory: (_usersRepository: UserRepositoryPort) => {
        return new GetUsersService(_usersRepository);
      },
      inject: [UserRepository],
    },
  ],
})
export class AccountModule {}
