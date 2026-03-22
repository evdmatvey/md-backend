import { UserRole } from '@/domains/enums';
import { UserStatusFilter } from '@/domains/types';

export class GetUsersQuery {
  public constructor(
    private readonly _username?: string,
    private readonly _role?: UserRole,
    private readonly _status?: UserStatusFilter,
    private readonly _createdAtStart?: Date,
    private readonly _createdAtEnd?: Date,
  ) {}

  public get username(): string | undefined {
    return this._username;
  }

  public get role(): UserRole | undefined {
    return this._role;
  }

  public get status(): UserStatusFilter | undefined {
    return this._status;
  }

  public get createdAtStart(): Date | undefined {
    return this._createdAtStart;
  }

  public get createdAtEnd(): Date | undefined {
    return this._createdAtEnd;
  }
}
