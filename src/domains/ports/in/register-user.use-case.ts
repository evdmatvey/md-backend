import { AuthResult } from '@/domains/types';
import { RegisterUserCommand } from './register-user.command';

export const RegisterUserUseCaseSymbol = Symbol('RegisterUserUseCaseSymbol');

export interface RegisterUserUseCase {
  execute(command: RegisterUserCommand): Promise<AuthResult>;
}
