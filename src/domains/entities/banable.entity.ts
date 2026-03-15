import {
  CannotBanYourselfError,
  CannotUnbanYourselfError,
} from '../errors/ban.error';
import { BanAction } from './ban-action.entity';
import { EntityWithId } from './entity-with-id.entity';
import { ModerationActionHistory } from './moderation-action-history.entity';
import { ModerationAction } from './moderation-action.entity';
import { UnbanAction } from './unban-action.entity';

export abstract class BanableEntity extends EntityWithId {
  public constructor(
    id: string,
    private readonly _banHistory: ModerationActionHistory,
  ) {
    super(id);
  }

  protected abstract throwUnexpectedBanActionError(isBanned: boolean): void;

  public ban(moderatorId: string, reason: string): void {
    if (moderatorId === this.id) throw new CannotBanYourselfError();

    if (this.isBanned) this.throwUnexpectedBanActionError(this.isBanned);

    this._banHistory.add(BanAction.create(moderatorId, reason));
  }

  public unban(moderatorId: string, reason: string): void {
    if (moderatorId === this.id) throw new CannotUnbanYourselfError();

    if (!this.isBanned) this.throwUnexpectedBanActionError(this.isBanned);

    this._banHistory.add(UnbanAction.create(moderatorId, reason));
  }

  public get isBanned(): boolean {
    return this._banHistory.isBanned;
  }

  public get banHistory(): readonly ModerationAction[] {
    return this._banHistory.history;
  }

  public get currentBan(): BanAction | null {
    return this._banHistory.currentBan;
  }
}
