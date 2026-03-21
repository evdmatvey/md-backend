import { Session, User } from '../entities';
import {
  SessionExpiredError,
  SessionMismatchError,
  SessionNotFoundError,
  SessionTokensMismatchError,
  UserBannedError,
  UserNotFoundError,
} from '../errors';
import { ExtendSessionCommand, ExtendSessionUseCase } from '../ports/in';
import {
  SessionCachePort,
  SessionRepositoryPort,
  TokenHasherPort,
  TokenServicePort,
  UserCachePort,
  UserRepositoryPort,
} from '../ports/out';
import { AuthResult } from '../types';

export class ExtendSessionService implements ExtendSessionUseCase {
  public constructor(
    private readonly _tokenService: TokenServicePort,
    private readonly _userRepository: UserRepositoryPort,
    private readonly _sessionRepository: SessionRepositoryPort,
    private readonly _tokenHasher: TokenHasherPort,
    private readonly _sessionCache: SessionCachePort,
    private readonly _userCache: UserCachePort,
  ) {}

  public async execute(command: ExtendSessionCommand): Promise<AuthResult> {
    const { refreshToken } = command;

    const { sessionId, userId } =
      await this._tokenService.verifyRefreshToken(refreshToken);

    const session = await this._getSessionById(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);

    if (session.userId !== userId) throw new SessionMismatchError();
    if (session.isExpired) throw new SessionExpiredError();

    const isTokensMatch = await this._tokenHasher.verify(
      refreshToken,
      session.refreshTokenHash,
    );
    if (!isTokensMatch) throw new SessionTokensMismatchError();

    const user = await this._getUserById(userId);
    if (!user) throw new UserNotFoundError({ id: userId });

    if (user.isBanned)
      throw new UserBannedError(
        user.username,
        user.currentBan!.reason,
        user.currentBan!.occurredAt,
      );

    const tokens = await this._tokenService.generatePair({
      userId,
      sessionId,
    });
    const hashedRefreshToken = await this._tokenHasher.hash(tokens.refresh);

    session.extend(hashedRefreshToken);
    await this._sessionCache.set(sessionId, session);

    return {
      tokens,
      user,
    };
  }

  private async _getSessionById(sessionId: string): Promise<Session | null> {
    const cachedSession = await this._sessionCache.get(sessionId);
    if (cachedSession) return cachedSession;

    const session = await this._sessionRepository.findById(sessionId);
    if (session) await this._sessionCache.set(sessionId, session);

    return session;
  }

  private async _getUserById(userId: string): Promise<User | null> {
    const cachedUser = await this._userCache.get(userId);
    if (cachedUser) return cachedUser;

    const user = await this._userRepository.findById(userId);
    if (user) await this._userCache.set(userId, user);

    return user;
  }
}
