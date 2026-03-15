import { NEW_ID } from '../constants/ids.constants';
import { UserRole } from '../enums/user-role.enum';
import { EntityWithId } from './entity-with-id.entity';

export class RoleAssignmentMetadata extends EntityWithId {
  public constructor(
    id: string,
    public readonly role: UserRole,
    public readonly assignedBy: string,
    public readonly reason: string,
    public readonly assignedAt: Date,
  ) {
    super(id);
  }

  public static assign(
    role: UserRole,
    assignedBy: string,
    reason: string,
  ): RoleAssignmentMetadata {
    return new RoleAssignmentMetadata(
      NEW_ID,
      role,
      assignedBy,
      reason,
      new Date(),
    );
  }
}
