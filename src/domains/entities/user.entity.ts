import { NEW_ID } from '../constants';
import { UserRole } from '../enums';
import {
  UserRoleAlreadyAssignedError,
  UserUnexpectedBanActionError,
} from '../errors/user.error';
import { BanableEntity } from './banable.entity';
import { ModerationActionHistory } from './moderation-action-history.entity';
import { RoleAssignmentHistory } from './role-assignment-history.entity';
import { RoleAssignmentMetadata } from './role-assignment-metadata.entity';

export class User extends BanableEntity {
  public constructor(
    id: string,
    public username: string,
    public passwordHash: string,
    public role: UserRole,
    public readonly createdAt: Date,
    private readonly _assignmentHistory: RoleAssignmentHistory,
    banHistory: ModerationActionHistory,
  ) {
    super(id, banHistory);
  }

  public static create(username: string, passwordHash: string): User {
    return new User(
      NEW_ID,
      username,
      passwordHash,
      UserRole.USER,
      new Date(),
      new RoleAssignmentHistory([]),
      new ModerationActionHistory([]),
    );
  }

  public promoteToModerator(adminId: string, reason: string): void {
    if (this.isModerator)
      throw new UserRoleAlreadyAssignedError(UserRole.MODERATOR);

    this.role = UserRole.MODERATOR;

    const assignment = RoleAssignmentMetadata.assign(
      UserRole.MODERATOR,
      adminId,
      reason,
    );
    this._assignmentHistory.add(assignment);
  }

  public promoteToAdmin(adminId: string, reason: string): void {
    if (this.isAdmin) throw new UserRoleAlreadyAssignedError(UserRole.ADMIN);

    this.role = UserRole.ADMIN;

    const assignment = RoleAssignmentMetadata.assign(
      UserRole.ADMIN,
      adminId,
      reason,
    );
    this._assignmentHistory.add(assignment);
  }

  public demoteToUser(adminId: string, reason: string): void {
    if (this.isUser) throw new UserRoleAlreadyAssignedError(UserRole.USER);

    this.role = UserRole.USER;

    const assignment = RoleAssignmentMetadata.assign(
      UserRole.USER,
      adminId,
      reason,
    );
    this._assignmentHistory.add(assignment);
  }

  public get isUser(): boolean {
    return this.role === UserRole.USER;
  }

  public get isModerator(): boolean {
    return this.role === UserRole.MODERATOR;
  }

  public get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  public get assignmentHistory(): readonly RoleAssignmentMetadata[] {
    return this._assignmentHistory.history;
  }

  public get isAssignmentHistoryUpdated(): boolean {
    return this._assignmentHistory.history.some((assignment) =>
      assignment.isNew(),
    );
  }

  protected throwUnexpectedBanActionError(isBanned: boolean): void {
    throw new UserUnexpectedBanActionError(isBanned);
  }
}
