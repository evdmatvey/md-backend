import { NEW_ID } from '../constants/ids.constants';
import { ModerationActionType } from '../enums/moderation-action-type.enum';
import { DocumentUnexpectedActionError } from '../errors/document.error';
import { BanAction } from './ban-action.entity';
import { EntityWithId } from './entity-with-id.entity';
import { ModerationActionHistory } from './moderation-action-history.entity';
import { ModerationAction } from './moderation-action.entity';
import { UnbanAction } from './unban-action.entity';

export class Document extends EntityWithId {
  public constructor(
    id: string,
    public readonly slug: string,
    public title: string,
    public markdown: string,
    public createdAt: Date,
    private readonly _banHistory: ModerationActionHistory,
  ) {
    super(id);
  }

  public static create(
    slug: string,
    title: string,
    markdown: string,
  ): Document {
    return new Document(
      NEW_ID,
      slug,
      title,
      markdown,
      new Date(),
      new ModerationActionHistory([]),
    );
  }

  public ban(moderatorId: string, reason: string): void {
    if (this.isBanned) throw new DocumentUnexpectedActionError(this.isBanned);

    this._banHistory.add(BanAction.create(moderatorId, reason));
  }

  public unban(moderatorId: string, reason: string): void {
    if (!this.isBanned) throw new DocumentUnexpectedActionError(this.isBanned);

    this._banHistory.add(UnbanAction.create(moderatorId, reason));
  }

  public get isBanned(): boolean {
    return this._banHistory.isBanned;
  }

  public get banHistory(): readonly ModerationAction[] {
    return this._banHistory.history;
  }

  public get currentBan(): BanAction | null {
    if (!this.isBanned) return null;

    if (this._banHistory.lastAction?.type === ModerationActionType.BAN)
      return this._banHistory.lastAction as BanAction;

    return null;
  }
}
