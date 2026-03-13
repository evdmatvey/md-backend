import { NEW_ID } from '../constants/ids.constants';
import { ModerationActionType } from '../enums/moderation-action-type.enum';
import { ModerationAction } from './moderation-action.entity';

export class BanAction extends ModerationAction {
  public constructor(
    id: string,
    moderatorId: string,
    reason: string,
    occurredAt: Date,
  ) {
    super(id, moderatorId, reason, occurredAt);
  }

  public static create(moderatorId: string, reason: string): BanAction {
    return new BanAction(NEW_ID, moderatorId, reason, new Date());
  }

  public get type(): ModerationActionType {
    return ModerationActionType.BAN;
  }
}
