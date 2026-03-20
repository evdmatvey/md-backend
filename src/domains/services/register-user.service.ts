import { Session, User } from '../entities';
import { UserAlreadyExistError } from '../errors';
import { RegisterUserCommand, RegisterUserUseCase } from '../ports/in';
import {
  PasswordHasherPort,
  SessionCachePort,
  SessionRepositoryPort,
  TokenHasherPort,
  TokenServicePort,
  UserAgentParserPort,
  UserCachePort,
  UserRepositoryPort,
} from '../ports/out';
import { AuthResult } from '../types';

export class RegisterUserService implements RegisterUserUseCase {
  public constructor(
    private readonly _tokenService: TokenServicePort,
    private readonly _userRepository: UserRepositoryPort,
    private readonly _sessionRepository: SessionRepositoryPort,
    private readonly _passwordHasher: PasswordHasherPort,
    private readonly _tokenHasher: TokenHasherPort,
    private readonly _userAgentParser: UserAgentParserPort,
    private readonly _userCache: UserCachePort,
    private readonly _sessionCache: SessionCachePort,
  ) {}

  public async execute(command: RegisterUserCommand): Promise<AuthResult> {
    const { password, username, userAgent } = command;

    const isExist = await this._userRepository.findByUsername(username);

    if (isExist) throw new UserAlreadyExistError(username);

    const hashedPassword = await this._passwordHasher.hash(password);

    const user = await this._userRepository.save(
      User.create(username, hashedPassword),
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

    await this._userCache.set(user.id, user);
    await this._sessionCache.set(session.id, session);

    return {
      tokens,
      user,
    };
  }
}
