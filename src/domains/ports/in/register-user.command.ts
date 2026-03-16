export class RegisterUserCommand {
  public constructor(
    private readonly _username: string,
    private readonly _password: string,
  ) {}

  public get username(): string {
    return this._username;
  }

  public get password(): string {
    return this._password;
  }
}
