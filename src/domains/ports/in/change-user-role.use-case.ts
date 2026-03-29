import { User } from '@/domains/entities';
import { ChangeUserRoleCommand } from './change-user-role.command';

export const ChangeUserRoleUseCaseSymbol = Symbol(
  'ChangeUserRoleUseCaseSymbol',
);

export interface ChangeUserRoleUseCase {
  execute(command: ChangeUserRoleCommand): Promise<User>;
}
