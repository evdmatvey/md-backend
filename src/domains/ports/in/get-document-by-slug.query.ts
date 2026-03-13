export class GetDocumentBySlugQuery {
  public constructor(private readonly _slug: string) {}

  public get slug(): string {
    return this._slug;
  }
}
