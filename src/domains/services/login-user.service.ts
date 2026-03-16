import { Session } from '../entities';
import {
  UserBannedError,
  UserNotFoundError,
  UserPasswordMismatchError,
} from '../errors';
import { LoginUserCommand, LoginUserUseCase } from '../ports/in';
import {
  PasswordHasherPort,
  SessionRepositoryPort,
  TokenHasherPort,
  TokenServicePort,
  UserAgentParserPort,
  UserRepositoryPort,
} from '../ports/out';
import { AuthResult } from '../types';

export class LoginUserService implements LoginUserUseCase {
  public constructor(
    private readonly _tokenService: TokenServicePort,
    private readonly _userRepository: UserRepositoryPort,
    private readonly _sessionRepository: SessionRepositoryPort,
    private readonly _passwordHasher: PasswordHasherPort,
    private readonly _tokenHasher: TokenHasherPort,
    private readonly _userAgentParser: UserAgentParserPort,
  ) {}

  public async execute(command: LoginUserCommand): Promise<AuthResult> {
    const { password, userAgent, username } = command;

    const user = await this._userRepository.findByUsername(username);

    if (!user) throw new UserNotFoundError({ username });

    const isPasswordMatch = await this._passwordHasher.verify(
      password,
      user.passwordHash,
    );

    if (!isPasswordMatch) throw new UserPasswordMismatchError();

    if (user.isBanned)
      throw new UserBannedError(
        user.username,
        user.currentBan!.reason,
        user.currentBan!.occurredAt,
      );

    const deviceInfo = this._userAgentParser.parse(userAgent);
    const session = await this._sessionRepository.save(
      Session.create(user.id, deviceInfo),
    );

    const tokens = await this._tokenService.generatePair({
      userId: user.id,
      sessionId: session.id,
    });
    const hashedRefreshToken = await this._tokenHasher.hash(tokens.refresh);
    session.extend(hashedRefreshToken);

    await this._sessionRepository.save(session);

    return {
      tokens,
      user,
    };
  }
}
