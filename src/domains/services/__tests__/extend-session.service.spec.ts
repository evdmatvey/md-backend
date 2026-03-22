import { Session, User } from '@/domains/entities';
import {
  SessionExpiredError,
  SessionMismatchError,
  SessionNotFoundError,
  SessionTokensMismatchError,
  UserBannedError,
  UserNotFoundError,
} from '@/domains/errors';
import { ExtendSessionCommand } from '@/domains/ports/in';
import {
  SessionCachePort,
  SessionRepositoryPort,
  TokenHasherPort,
  TokenServicePort,
  UserCachePort,
  UserRepositoryPort,
} from '@/domains/ports/out';
import { ExtendSessionService } from '../extend-session.service';

describe('ExtendSessionService', () => {
  let tokenServicePort: jest.Mocked<TokenServicePort>;
  let userRepositoryPort: jest.Mocked<UserRepositoryPort>;
  let sessionRepositoryPort: jest.Mocked<SessionRepositoryPort>;
  let tokenHasherPort: jest.Mocked<TokenHasherPort>;
  let sessionCachePort: jest.Mocked<SessionCachePort>;
  let userCachePort: jest.Mocked<UserCachePort>;
  let extendSessionService: ExtendSessionService;

  beforeEach(() => {
    tokenServicePort = {
      generatePair: jest.fn(),
      verifyRefreshToken: jest.fn(),
    } as jest.Mocked<TokenServicePort>;
    userRepositoryPort = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<UserRepositoryPort>;
    sessionRepositoryPort = {
      delete: jest.fn(),
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<SessionRepositoryPort>;
    tokenHasherPort = {
      hash: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<TokenHasherPort>;
    sessionCachePort = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<SessionCachePort>;
    userCachePort = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserCachePort>;

    extendSessionService = new ExtendSessionService(
      tokenServicePort,
      userRepositoryPort,
      sessionRepositoryPort,
      tokenHasherPort,
      sessionCachePort,
      userCachePort,
    );
  });

  it('Should success extend session', async () => {
    setupSuccessfulExtend();

    const command = new ExtendSessionCommand('refreshToken');
    const authResult = await extendSessionService.execute(command);

    expect(authResult.user.username).toBe('username');
    expect(authResult.tokens.refresh).toBe('newRefreshToken');

    expect(tokenHasherPort.hash).toHaveBeenCalledWith('newRefreshToken');
  });

  it('Should throw session not found error', async () => {
    setupSessionNotFoundExtend();

    const command = new ExtendSessionCommand('refreshToken');
    expect(extendSessionService.execute(command)).rejects.toThrow(
      new SessionNotFoundError('sessionId'),
    );
  });

  it('Should throw session expired error', async () => {
    setupSessionExpiredExtend();

    const command = new ExtendSessionCommand('refreshToken');
    expect(extendSessionService.execute(command)).rejects.toThrow(
      SessionExpiredError,
    );
  });

  it('Should throw session tokens mismatch error', async () => {
    setupSessionTokensMismatchExtend();

    const command = new ExtendSessionCommand('refreshToken');
    expect(extendSessionService.execute(command)).rejects.toThrow(
      new SessionTokensMismatchError(),
    );
  });

  it('Should throw user not found error', async () => {
    setupUserNotFoundExtend();

    const command = new ExtendSessionCommand('refreshToken');
    expect(extendSessionService.execute(command)).rejects.toThrow(
      new UserNotFoundError({ id: 'userId' }),
    );
  });

  it('Should throw user banned error', async () => {
    setupUserBannedExtend();

    const command = new ExtendSessionCommand('refreshToken');
    expect(extendSessionService.execute(command)).rejects.toThrow(
      UserBannedError,
    );
  });

  it('Should throw session mismatch error', async () => {
    setupSessionMismatchExtend();

    const command = new ExtendSessionCommand('refreshToken');
    expect(extendSessionService.execute(command)).rejects.toThrow(
      new SessionMismatchError(),
    );
  });

  function setupSuccessfulExtend() {
    tokenServicePort.verifyRefreshToken.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });
    const session = Session.create('userId', {
      browser: 'Chrome',
      os: 'Windows',
    });
    session.extend('');
    sessionCachePort.get.mockResolvedValue(null);
    sessionRepositoryPort.findById.mockResolvedValue(session);
    tokenHasherPort.verify.mockResolvedValue(true);
    userCachePort.get.mockResolvedValue(null);
    userRepositoryPort.findById.mockResolvedValue(
      User.create('username', 'passwordHash'),
    );
    tokenServicePort.generatePair.mockResolvedValue({
      access: 'newAccessToken',
      refresh: 'newRefreshToken',
    });
    tokenHasherPort.hash.mockResolvedValue('hashedRefreshToken');
  }

  function setupSessionNotFoundExtend() {
    tokenServicePort.verifyRefreshToken.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });
    sessionCachePort.get.mockResolvedValue(null);
    sessionRepositoryPort.findById.mockResolvedValue(null);
  }

  function setupSessionExpiredExtend() {
    tokenServicePort.verifyRefreshToken.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });

    const session = Session.create('userId', {
      browser: 'Chrome',
      os: 'Windows',
    });
    session.expiresAt = new Date('2025-10-10');
    sessionCachePort.get.mockResolvedValue(null);
    sessionRepositoryPort.findById.mockResolvedValue(session);
  }

  function setupSessionTokensMismatchExtend() {
    tokenServicePort.verifyRefreshToken.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });
    const session = Session.create('userId', {
      browser: 'Chrome',
      os: 'Windows',
    });
    session.extend('');
    sessionCachePort.get.mockResolvedValue(null);
    sessionRepositoryPort.findById.mockResolvedValue(session);
    tokenHasherPort.verify.mockResolvedValue(false);
  }

  function setupUserNotFoundExtend() {
    tokenServicePort.verifyRefreshToken.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });
    const session = Session.create('userId', {
      browser: 'Chrome',
      os: 'Windows',
    });
    session.extend('');

    sessionCachePort.get.mockResolvedValue(null);
    sessionRepositoryPort.findById.mockResolvedValue(session);
    tokenHasherPort.verify.mockResolvedValue(true);
    userCachePort.get.mockResolvedValue(null);
    userRepositoryPort.findById.mockResolvedValue(null);
  }

  function setupUserBannedExtend() {
    tokenServicePort.verifyRefreshToken.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });
    const session = Session.create('userId', {
      browser: 'Chrome',
      os: 'Windows',
    });
    session.extend('');
    const user = User.create('username', 'passwordHash');
    user.ban('adminId', 'reason');

    sessionCachePort.get.mockResolvedValue(null);
    sessionRepositoryPort.findById.mockResolvedValue(session);
    tokenHasherPort.verify.mockResolvedValue(true);
    userCachePort.get.mockResolvedValue(null);
    userRepositoryPort.findById.mockResolvedValue(user);
  }

  function setupSessionMismatchExtend() {
    tokenServicePort.verifyRefreshToken.mockResolvedValue({
      userId: 'userId',
      sessionId: 'sessionId',
    });
    const session = Session.create('anotherUserId', {
      browser: 'Chrome',
      os: 'Windows',
    });
    session.extend('');

    sessionCachePort.get.mockResolvedValue(null);
    sessionRepositoryPort.findById.mockResolvedValue(session);
  }
});
