import { Session } from '../entities';
import { SessionNotFoundError } from '../errors';
import { LogoutUserCommand, LogoutUserUseCase } from '../ports/in';
import {
  SessionCachePort,
  SessionRepositoryPort,
  TokenServicePort,
} from '../ports/out';

export class LogoutUserService implements LogoutUserUseCase {
  public constructor(
    private readonly _tokenService: TokenServicePort,
    private readonly _sessionRepository: SessionRepositoryPort,
    private readonly _sessionCache: SessionCachePort,
  ) {}

  public async execute(command: LogoutUserCommand): Promise<void> {
    const { refreshToken } = command;
    const { sessionId } =
      await this._tokenService.verifyRefreshToken(refreshToken);

    const session = await this._getSessionById(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);

    session.revoke();

    await this._sessionCache.delete(sessionId);
    await this._sessionRepository.save(session);
  }

  private async _getSessionById(sessionId: string): Promise<Session | null> {
    const cachedSession = await this._sessionCache.get(sessionId);
    if (cachedSession) return cachedSession;

    return this._sessionRepository.findById(sessionId);
  }
}
