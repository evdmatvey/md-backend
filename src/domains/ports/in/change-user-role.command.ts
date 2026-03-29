import { UserRole } from '@/domains/enums';

export class ChangeUserRoleCommand {
  public constructor(
    private readonly _userId: string,
    private readonly _adminId: string,
    private readonly _reason: string,
    private readonly _role: UserRole,
  ) {}

  public get userId(): string {
    return this._userId;
  }

  public get role(): UserRole {
    return this._role;
  }

  public get reason(): string {
    return this._reason;
  }

  public get adminId(): string {
    return this._adminId;
  }
}
