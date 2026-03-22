export class ExtendSessionCommand {
  public constructor(private readonly _refreshToken: string) {}

  public get refreshToken(): string {
    return this._refreshToken;
  }
}
