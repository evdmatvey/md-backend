import { ModerationActionType, UserRole } from '@/domains/enums';

export type CachedUser = {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  assignments: CachedRoleAssignment[];
  bans: CachedUserBan[];
};

export type CachedRoleAssignment = {
  id: string;
  role: UserRole;
  assignedBy: string;
  reason: string;
  assignedAt: Date;
};

export type CachedUserBan = {
  id: string;
  moderatorId: string;
  reason: string;
  occurredAt: Date;
  type: ModerationActionType;
};
