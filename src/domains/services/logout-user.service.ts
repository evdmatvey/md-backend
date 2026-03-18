import { SessionNotFoundError } from '../errors';
import { LogoutUserCommand, LogoutUserUseCase } from '../ports/in';
import { SessionRepositoryPort, TokenServicePort } from '../ports/out';

export class LogoutUserService implements LogoutUserUseCase {
  public constructor(
    private readonly _tokenService: TokenServicePort,
    private readonly _sessionRepository: SessionRepositoryPort,
  ) {}

  public async execute(command: LogoutUserCommand): Promise<void> {
    const { refreshToken } = command;
    const { sessionId } = await this._tokenService.verify(refreshToken);

    const session = await this._sessionRepository.findById(sessionId);
    if (!session) throw new SessionNotFoundError(sessionId);

    session.revoke();

    await this._sessionRepository.save(session);
  }
}
