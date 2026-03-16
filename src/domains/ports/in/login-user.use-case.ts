import { AuthResult } from '@/domains/types';
import { LoginUserCommand } from './login-user.command';

export const LoginUserUseCaseSymbol = Symbol('LoginUserUseCaseSymbol');

export interface LoginUserUseCase {
  execute(command: LoginUserCommand): Promise<AuthResult>;
}
