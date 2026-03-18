import { Session } from '@/domains/entities';
import { SessionNotFoundError } from '@/domains/errors';
import { LogoutUserCommand } from '@/domains/ports/in';
import { SessionRepositoryPort, TokenServicePort } from '@/domains/ports/out';
import { LogoutUserService } from '../logout-user.service';

describe('LogoutUserService', () => {
  let sessionRepositoryPort: jest.Mocked<SessionRepositoryPort>;
  let tokenServicePort: jest.Mocked<TokenServicePort>;
  let logoutUserService: LogoutUserService;

  beforeEach(() => {
    sessionRepositoryPort = {
      save: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAllByUserId: jest.fn(),
    } as jest.Mocked<SessionRepositoryPort>;

    tokenServicePort = {
      generatePair: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<TokenServicePort>;

    logoutUserService = new LogoutUserService(
      tokenServicePort,
      sessionRepositoryPort,
    );
  });

  it('Should success logout user', async () => {
    setupSuccessfulLogout();

    const command = new LogoutUserCommand('refreshToken');
    await logoutUserService.execute(command);

    expect(sessionRepositoryPort.save).toHaveBeenCalledWith(
      expect.objectContaining({ isRevoked: true }),
    );
  });

  it('Should throw session not found error', async () => {
    setupNotFoundLogin();

    const command = new LogoutUserCommand('refreshToken');

    expect(logoutUserService.execute(command)).rejects.toThrow(
      new SessionNotFoundError('sessionId'),
    );
  });

  function setupSuccessfulLogout() {
    tokenServicePort.verify.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });
    sessionRepositoryPort.findById.mockResolvedValue(
      Session.create('userId', { browser: 'Chrome', os: 'Windows' }),
    );
  }

  function setupNotFoundLogin() {
    tokenServicePort.verify.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });
    sessionRepositoryPort.findById.mockResolvedValue(null);
  }
});
