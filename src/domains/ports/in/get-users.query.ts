import { UserRole } from '@/domains/enums';

export class GetUsersQuery {
  public constructor(
    private readonly _username?: string,
    private readonly _role?: UserRole,
    private readonly _isBanned?: boolean,
    private readonly _createdAtStart?: Date,
    private readonly _createdAtEnd?: Date,
  ) {}

  public get username(): string | undefined {
    return this._username;
  }

  public get role(): UserRole | undefined {
    return this._role;
  }

  public get isBanned(): boolean | undefined {
    return this._isBanned;
  }

  public get createdAtStart(): Date | undefined {
    return this._createdAtStart;
  }

  public get createdAtEnd(): Date | undefined {
    return this._createdAtEnd;
  }
}
