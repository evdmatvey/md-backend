export class CreateDocumentCommand {
  public constructor(
    private readonly _title: string,
    private readonly _markdown: string,
  ) {}

  public get title(): string {
    return this._title;
  }

  public get markdown(): string {
    return this._markdown;
  }
}
