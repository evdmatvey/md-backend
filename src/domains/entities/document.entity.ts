import { NEW_ID } from '../constants';
import { DocumentUnexpectedActionError } from '../errors/document.error';
import { BanableEntity } from './banable.entity';
import { ModerationActionHistory } from './moderation-action-history.entity';

export class Document extends BanableEntity {
  public constructor(
    id: string,
    public readonly slug: string,
    public title: string,
    public markdown: string,
    public createdAt: Date,
    banHistory: ModerationActionHistory,
  ) {
    super(id, banHistory);
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

  protected throwUnexpectedBanActionError(isBanned: boolean): void {
    throw new DocumentUnexpectedActionError(isBanned);
  }
}
