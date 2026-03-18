import {
  SessionExpiredError,
  SessionMismatchError,
  SessionNotFoundError,
  SessionTokensMismatchError,
  UserNotFoundError,
} from '../errors';
import { ExtendSessionCommand, ExtendSessionUseCase } from '../ports/in';
import {
  SessionRepositoryPort,
  TokenHasherPort,
  TokenServicePort,
  UserRepositoryPort,
} from '../ports/out';
import { AuthResult } from '../types';

export class ExtendSessionService implements ExtendSessionUseCase {
  public constructor(
    private readonly _tokenService: TokenServicePort,
    private readonly _userRepository: UserRepositoryPort,
    private readonly _sessionRepository: SessionRepositoryPort,
    private readonly _tokenHasher: TokenHasherPort,
  ) {}

  public async execute(command: ExtendSessionCommand): Promise<AuthResult> {
    const { refreshToken } = command;

    const { sessionId, userId } = await this._tokenService.verify(refreshToken);

    const session = await this._sessionRepository.findById(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);

    if (session.userId !== userId) throw new SessionMismatchError();
    if (session.isExpired) throw new SessionExpiredError();

    const isTokensMatch = await this._tokenHasher.verify(
      refreshToken,
      session.refreshTokenHash,
    );
    if (!isTokensMatch) throw new SessionTokensMismatchError();

    const user = await this._userRepository.findById(userId);
    if (!user) throw new UserNotFoundError({ id: userId });

    const tokens = await this._tokenService.generatePair({
      userId,
      sessionId,
    });
    const hashedRefreshToken = await this._tokenHasher.hash(tokens.refresh);

    session.extend(hashedRefreshToken);

    return {
      tokens,
      user,
    };
  }
}
