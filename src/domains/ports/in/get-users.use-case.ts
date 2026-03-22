import { User } from '@/domains/entities';
import { GetUsersQuery } from './get-users.query';

export const GetUsersUseCaseSymbol = Symbol('GetUsersUseCaseSymbol');

export interface GetUsersUseCase {
  execute(query: GetUsersQuery): Promise<User[]>;
}
