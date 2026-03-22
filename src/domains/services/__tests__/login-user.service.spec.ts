import { Session, User } from '@/domains/entities';
import {
  UserBannedError,
  UserNotFoundError,
  UserPasswordMismatchError,
} from '@/domains/errors';
import { LoginUserCommand } from '@/domains/ports/in';
import {
  PasswordHasherPort,
  SessionCachePort,
  SessionRepositoryPort,
  TokenHasherPort,
  TokenServicePort,
  UserAgentParserPort,
  UserCachePort,
  UserRepositoryPort,
} from '@/domains/ports/out';
import { DeviceInfo, Tokens } from '@/domains/types';
import { LoginUserService } from '../login-user.service';

describe('LoginUserService', () => {
  let tokenServicePort: jest.Mocked<TokenServicePort>;
  let userRepositoryPort: jest.Mocked<UserRepositoryPort>;
  let sessionRepositoryPort: jest.Mocked<SessionRepositoryPort>;
  let passwordHasherPort: jest.Mocked<PasswordHasherPort>;
  let tokenHasherPort: jest.Mocked<TokenHasherPort>;
  let userAgentParserPort: jest.Mocked<UserAgentParserPort>;
  let userCachePort: jest.Mocked<UserCachePort>;
  let sessionCachePort: jest.Mocked<SessionCachePort>;
  let loginUserService: LoginUserService;

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
      save: jest.fn(),
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<SessionRepositoryPort>;
    passwordHasherPort = {
      hash: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<PasswordHasherPort>;
    tokenHasherPort = {
      hash: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<TokenHasherPort>;
    userAgentParserPort = {
      parse: jest.fn(),
    } as jest.Mocked<UserAgentParserPort>;
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

    loginUserService = new LoginUserService(
      tokenServicePort,
      userRepositoryPort,
      sessionRepositoryPort,
      passwordHasherPort,
      tokenHasherPort,
      userAgentParserPort,
      userCachePort,
      sessionCachePort,
    );
  });

  it('Should successfully login user', async () => {
    setupSuccessfulLogin();

    const command = new LoginUserCommand('username', 'password', 'Mozilla...');
    const authResult = await loginUserService.execute(command);

    expect(authResult.user.username).toBe('username');

    expect(sessionRepositoryPort.save).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ refreshTokenHash: '' }),
    );
    expect(sessionRepositoryPort.save).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ refreshTokenHash: 'hashedToken' }),
    );
  });

  it('Should throw user not found error', async () => {
    setupUserNotFoundLogin();

    const command = new LoginUserCommand('username', 'password', 'Mozilla...');
    expect(loginUserService.execute(command)).rejects.toThrow(
      new UserNotFoundError({ username: 'username' }),
    );
  });

  it('Should throw password mismatch error', async () => {
    setupPasswordMismatchLogin();

    const command = new LoginUserCommand('username', 'password', 'Mozilla...');
    expect(loginUserService.execute(command)).rejects.toThrow(
      new UserPasswordMismatchError(),
    );
  });

  it('Should throw user banned error', async () => {
    setupUserBannedLogin();

    const command = new LoginUserCommand('username', 'password', 'Mozilla...');
    expect(loginUserService.execute(command)).rejects.toThrow(
      new UserBannedError('username', 'reason', new Date()),
    );
  });

  function setupSuccessfulLogin() {
    const parsedUserAgent: DeviceInfo = {
      browser: 'Chrome',
      os: 'Windows',
    };
    const tokensPair: Tokens = {
      access: 'accessToken',
      refresh: 'refreshToken',
    };
    const user = User.create('username', 'hashedPassword');
    const createdSession = Session.create(user.id, parsedUserAgent);
    const extendedSession = Session.create(user.id, parsedUserAgent);
    extendedSession.extend(tokensPair.refresh);

    userRepositoryPort.findByUsername.mockResolvedValue(user);
    passwordHasherPort.verify.mockResolvedValue(true);
    tokenServicePort.generatePair.mockResolvedValue(tokensPair);
    tokenHasherPort.hash.mockResolvedValue('hashedToken');
    userAgentParserPort.parse.mockReturnValue(parsedUserAgent);
    sessionRepositoryPort.save
      .mockResolvedValueOnce(createdSession)
      .mockResolvedValueOnce(extendedSession);
  }

  function setupUserNotFoundLogin() {
    userRepositoryPort.findByUsername.mockResolvedValue(null);
  }

  function setupPasswordMismatchLogin() {
    const user = User.create('username', 'hashedPassword');

    userRepositoryPort.findByUsername.mockResolvedValue(user);
    passwordHasherPort.verify.mockResolvedValue(false);
  }

  function setupUserBannedLogin() {
    const user = User.create('username', 'hashedPassword');
    user.ban('adminId', 'reason');

    userRepositoryPort.findByUsername.mockResolvedValue(user);
    passwordHasherPort.verify.mockResolvedValue(true);
  }
});
