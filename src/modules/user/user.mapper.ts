import {
  BanAction,
  ModerationAction,
  ModerationActionHistory,
  RoleAssignmentHistory,
  RoleAssignmentMetadata,
  UnbanAction,
  User,
} from '@/domains/entities';
import { ModerationActionType } from '@/domains/enums';
import { UserEntity } from './entities/user.entity';
import {
  CachedRoleAssignment,
  CachedUser,
  CachedUserBan,
} from './types/cached-user.type';

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
      assignments: assignmentHistory.map((assignment) =>
        this.mapAssignmentToCached(assignment),
      ),
      bans: banHistory.map((ban) => this.mapUserBanToCached(ban)),
    };
  }

  public static mapFromCached(cached: CachedUser): User {
    const { id, username, passwordHash, role, createdAt, assignments, bans } =
      cached;

    const mappedAssignments = assignments.map((assignment) =>
      this.mapAssignmentFromCached(assignment),
    );
    const mappedBans = bans.map((ban) => this.mapUserBanFromCached(ban));

    const banHistory = new ModerationActionHistory(mappedBans);
    const assignmentHistory = new RoleAssignmentHistory(mappedAssignments);

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

  public static mapAssignmentFromCached(
    cached: CachedRoleAssignment,
  ): RoleAssignmentMetadata {
    const { id, assignedBy, assignedAt, reason, role } = cached;

    return new RoleAssignmentMetadata(id, role, assignedBy, reason, assignedAt);
  }

  public static mapAssignmentToCached(
    assignment: RoleAssignmentMetadata,
  ): CachedRoleAssignment {
    const { id, assignedBy, assignedAt, reason, role } = assignment;

    return { id, assignedAt, assignedBy, reason, role };
  }

  public static mapUserBanFromCached(cached: CachedUserBan): ModerationAction {
    const { id, moderatorId, reason, type, occurredAt } = cached;

    if (type === ModerationActionType.BAN)
      return new BanAction(id, moderatorId, reason, occurredAt);

    return new UnbanAction(id, moderatorId, reason, occurredAt);
  }

  public static mapUserBanToCached(ban: ModerationAction): CachedUserBan {
    const { id, moderatorId, reason, type, occurredAt } = ban;

    return { id, moderatorId, reason, type, occurredAt };
  }
}
