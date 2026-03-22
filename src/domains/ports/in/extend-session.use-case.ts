import { AuthResult } from '@/domains/types';
import { ExtendSessionCommand } from './extend-session.command';

export const ExtendSessionUseCaseSymbol = Symbol('ExtendSessionUseCaseSymbol');

export interface ExtendSessionUseCase {
  execute(command: ExtendSessionCommand): Promise<AuthResult>;
}
