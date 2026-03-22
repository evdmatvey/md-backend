import { User } from '../entities';
import { UserRole } from '../enums';
import { GetUsersQuery, GetUsersUseCase } from '../ports/in';
import { UserRepositoryPort } from '../ports/out';
import { UserStatusFilter } from '../types';

export class GetUsersService implements GetUsersUseCase {
  public constructor(private readonly _userRepository: UserRepositoryPort) {}

  public async execute(query: GetUsersQuery): Promise<User[]> {
    const allUsers = await this._userRepository.findAll();

    const filters = [
      (users: User[]) => this._filterByUsername(users, query.username),
      (users: User[]) => this._filterByRole(users, query.role),
      (users: User[]) => this._filterByStatus(users, query.status),
      (users: User[]) =>
        this._filterByCreatedAtRange(
          users,
          query.createdAtStart,
          query.createdAtEnd,
        ),
    ];

    return filters.reduce((acc, filter) => filter(acc), allUsers);
  }

  private _filterByUsername(users: User[], username?: string): User[] {
    if (!username) return users;

    return users.filter((user) =>
      user.username.toLowerCase().includes(username.toLowerCase()),
    );
  }

  private _filterByRole(users: User[], role?: UserRole): User[] {
    if (!role) return users;

    return users.filter((user) => user.role === role);
  }

  private _filterByStatus(users: User[], status?: UserStatusFilter): User[] {
    if (!status || status === 'all') return users;

    const isSearchBanned = status === 'banned';
    return users.filter((user) => user.isBanned === isSearchBanned);
  }

  private _filterByCreatedAtRange(
    users: User[],
    start?: Date,
    end?: Date,
  ): User[] {
    if (!start && !end) return users;

    return users.filter((user) => {
      if (start && user.createdAt < start) return false;
      if (end && user.createdAt > end) return false;

      return true;
    });
  }
}
