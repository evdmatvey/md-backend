import { Session, User } from '@/domains/entities';
import { UserAlreadyExistError } from '@/domains/errors';
import { RegisterUserCommand } from '@/domains/ports/in';
import {
  PasswordHasherPort,
  SessionRepositoryPort,
  TokenHasherPort,
  TokenServicePort,
  UserAgentParserPort,
  UserRepositoryPort,
} from '@/domains/ports/out';
import { DeviceInfo, Tokens } from '@/domains/types';
import { RegisterUserService } from '../register-user.service';

describe('RegisterUserService', () => {
  let tokenServicePort: jest.Mocked<TokenServicePort>;
  let userRepositoryPort: jest.Mocked<UserRepositoryPort>;
  let sessionRepositoryPort: jest.Mocked<SessionRepositoryPort>;
  let passwordHasherPort: jest.Mocked<PasswordHasherPort>;
  let tokenHasherPort: jest.Mocked<TokenHasherPort>;
  let userAgentParserPort: jest.Mocked<UserAgentParserPort>;
  let registerUserService: RegisterUserService;

  beforeEach(() => {
    tokenServicePort = {
      generatePair: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<TokenServicePort>;
    userRepositoryPort = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<UserRepositoryPort>;
    sessionRepositoryPort = {
      delete: jest.fn(),
      getAllByUserId: jest.fn(),
      getById: jest.fn(),
      save: jest.fn(),
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

    registerUserService = new RegisterUserService(
      tokenServicePort,
      userRepositoryPort,
      sessionRepositoryPort,
      passwordHasherPort,
      tokenHasherPort,
      userAgentParserPort,
    );
  });

  it('Should successfully register user', async () => {
    setupSuccessfulRegistration();

    const command = new RegisterUserCommand(
      'username',
      'password',
      'Mozilla...',
    );

    const authResult = await registerUserService.execute(command);

    expect(authResult.user.username).toBe(command.username);
    expect(authResult.user.passwordHash).toBe('hashedPassword');

    expect(sessionRepositoryPort.save).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ refreshTokenHash: '' }),
    );
    expect(sessionRepositoryPort.save).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ refreshTokenHash: 'hashedToken' }),
    );
  });

  it('Should throw user already exist error', async () => {
    setupUserAlreadyExist();

    const command = new RegisterUserCommand(
      'username',
      'password',
      'Mozilla...',
    );

    expect(registerUserService.execute(command)).rejects.toThrow(
      new UserAlreadyExistError(command.username),
    );
  });

  function setupSuccessfulRegistration() {
    const parsedUserAgent: DeviceInfo = {
      browser: 'Chrome',
      os: 'Windows',
    };
    const tokensPair: Tokens = {
      access: 'accessToken',
      refresh: 'refreshToken',
    };
    const createdUser = User.create('username', 'hashedPassword');
    const createdSession = Session.create(createdUser.id, parsedUserAgent);
    const extendedSession = Session.create(createdSession.id, parsedUserAgent);
    extendedSession.extend(tokensPair.refresh);

    userRepositoryPort.findByUsername.mockResolvedValue(null);
    passwordHasherPort.hash.mockResolvedValue('hashedPassword');
    userRepositoryPort.save.mockResolvedValue(createdUser);
    tokenServicePort.generatePair.mockResolvedValue(tokensPair);
    tokenHasherPort.hash.mockResolvedValue('hashedToken');
    userAgentParserPort.parse.mockReturnValue(parsedUserAgent);
    sessionRepositoryPort.save
      .mockResolvedValueOnce(createdSession)
      .mockResolvedValueOnce(extendedSession);
  }

  function setupUserAlreadyExist() {
    const existedUser = User.create('username', 'hashedPassword');

    userRepositoryPort.findByUsername.mockResolvedValue(existedUser);
  }
});
