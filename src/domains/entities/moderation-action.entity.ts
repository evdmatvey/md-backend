import { ModerationActionType } from '../enums/moderation-action-type.enum';
import { EntityWithId } from './entity-with-id.entity';

export abstract class ModerationAction extends EntityWithId {
  public constructor(
    id: string,
    public readonly moderatorId: string,
    public readonly reason: string,
    public readonly occurredAt: Date,
  ) {
    super(id);
  }

  public abstract get type(): ModerationActionType;
}
