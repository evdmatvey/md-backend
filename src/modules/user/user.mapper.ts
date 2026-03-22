import {
  BanAction,
  ModerationActionHistory,
  RoleAssignmentHistory,
  RoleAssignmentMetadata,
  UnbanAction,
  User,
} from '@/domains/entities';
import { ModerationActionType } from '@/domains/enums';
import { UserEntity } from './entities/user.entity';
import { CachedUser } from './types/cached-user.type';

export class UserMapper {
  public static mapToDomain(entity: UserEntity): User {
    const {
      id,
      username,
      role,
      passwordHash,
      bans,
      roleAssignments,
      createdAt,
    } = entity;

    const mappedRoleAssignments = (roleAssignments ?? []).map(
      (assignment) =>
        new RoleAssignmentMetadata(
          assignment.id,
          assignment.role,
          assignment.adminId,
          assignment.reason,
          assignment.createdAt,
        ),
    );

    const mappedBans = (bans ?? []).map((ban) => {
      if (ban.type === ModerationActionType.BAN) {
        return new BanAction(ban.id, ban.adminId, ban.reason, ban.createdAt);
      } else {
        return new UnbanAction(ban.id, ban.adminId, ban.reason, ban.createdAt);
      }
    });

    const banHistory = new ModerationActionHistory(mappedBans);
    const assignmentHistory = new RoleAssignmentHistory(mappedRoleAssignments);

    return new User(
      id,
      username,
      passwordHash,
      role,
      createdAt,
      assignmentHistory,
      banHistory,
    );
  }

  public static mapToCached(user: User): CachedUser {
    const {
      id,
      username,
      passwordHash,
      role,
      createdAt,
      assignmentHistory,
      banHistory,
    } = user;

    return {
      id,
      username,
      passwordHash,
      role,
      createdAt: createdAt.toISOString(),
      assignments: assignmentHistory,
      bans: banHistory,
    };
  }
  public static mapFromCached(cached: CachedUser): User {
    const { id, username, passwordHash, role, createdAt, assignments, bans } =
      cached;

    const banHistory = new ModerationActionHistory([...bans]);
    const assignmentHistory = new RoleAssignmentHistory([...assignments]);

    return new User(
      id,
      username,
      passwordHash,
      role,
      new Date(createdAt),
      assignmentHistory,
      banHistory,
    );
  }
}
