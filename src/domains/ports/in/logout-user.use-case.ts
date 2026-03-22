import { LogoutUserCommand } from './logout-user.command';

export const LogoutUserUseCaseSymbol = Symbol('LogoutUserUseCaseSymbol');

export interface LogoutUserUseCase {
  execute(command: LogoutUserCommand): Promise<void>;
}
