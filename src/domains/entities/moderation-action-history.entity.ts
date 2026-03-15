import { ModerationActionType } from '../enums/moderation-action-type.enum';
import { BanAction } from './ban-action.entity';
import { ModerationAction } from './moderation-action.entity';

export class ModerationActionHistory {
  private readonly _history: ModerationAction[];

  public constructor(history: ModerationAction[]) {
    this._history = [...history];
  }

  public add(action: ModerationAction): void {
    this._history.push(action);
  }

  public get lastAction(): ModerationAction | null {
    const lastAction = this._history.at(-1);

    if (!lastAction) return null;

    return lastAction;
  }

  public get currentBan(): BanAction | null {
    if (!this.isBanned) return null;

    if (this.lastAction?.type === ModerationActionType.BAN)
      return this.lastAction as BanAction;

    return null;
  }

  public get isBanned(): boolean {
    if (this._history.length === 0) return false;

    const lastAction = this._history.at(-1);

    return lastAction?.type === ModerationActionType.BAN;
  }

  public get history(): readonly ModerationAction[] {
    return Object.freeze([...this._history]);
  }
}
