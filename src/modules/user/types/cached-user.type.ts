import { ModerationAction, RoleAssignmentMetadata } from '@/domains/entities';
import { UserRole } from '@/domains/enums';

export type CachedUser = {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  assignments: readonly RoleAssignmentMetadata[];
  bans: readonly ModerationAction[];
};
