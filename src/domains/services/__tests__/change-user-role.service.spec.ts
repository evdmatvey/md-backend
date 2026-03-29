import {
  ModerationActionHistory,
  RoleAssignmentHistory,
  User,
} from '@/domains/entities';
import { UserRole } from '@/domains/enums';
import {
  UnexpectedRoleActionError,
  UserNotFoundError,
  UserRoleAlreadyAssignedError,
} from '@/domains/errors';
import { ChangeUserRoleCommand } from '@/domains/ports/in';
import { UserCachePort, UserRepositoryPort } from '@/domains/ports/out';
import { ChangeUserRoleService } from '../change-user-role.service';

describe('ChangeUserRoleService', () => {
  let userRepositoryPort: jest.Mocked<UserRepositoryPort>;
  let userCachePort: jest.Mocked<UserCachePort>;
  let changeUserRoleService: ChangeUserRoleService;

  beforeEach(() => {
    userRepositoryPort = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
    };
    userCachePort = {
      delete: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
    };

    changeUserRoleService = new ChangeUserRoleService(
      userRepositoryPort,
      userCachePort,
    );
  });

  it('Should successfully change role', async () => {
    setupSuccessChangeRole();

    const command = new ChangeUserRoleCommand(
      'userId',
      'adminId',
      'reason',
      UserRole.MODERATOR,
    );
    const result = await changeUserRoleService.execute(command);

    expect(result.role).toBe(UserRole.MODERATOR);
    expect(result.assignmentHistory.at(-1)?.assignedBy).toBe('adminId');
    expect(result.assignmentHistory.at(-1)?.role).toBe(UserRole.MODERATOR);
  });

  it('Should throw UserNotFountError if user not found', async () => {
    setupUserNotFoundError();

    const command = new ChangeUserRoleCommand(
      'userId',
      'adminId',
      'reason',
      UserRole.MODERATOR,
    );

    expect(changeUserRoleService.execute(command)).rejects.toThrow(
      UserNotFoundError,
    );
  });

  it('Should throw UnexpectedRoleActionError if user equals admin', async () => {
    setupUnexpectedRoleActionError();

    const command = new ChangeUserRoleCommand(
      'userId',
      'adminId',
      'reason',
      UserRole.MODERATOR,
    );

    expect(changeUserRoleService.execute(command)).rejects.toThrow(
      UnexpectedRoleActionError,
    );
  });

  it('Should throw UserRoleAlreadyAssignedError if user has role', async () => {
    setupUserRoleAlreadyAssignedError();

    const command = new ChangeUserRoleCommand(
      'userId',
      'adminId',
      'reason',
      UserRole.MODERATOR,
    );

    expect(changeUserRoleService.execute(command)).rejects.toThrow(
      UserRoleAlreadyAssignedError,
    );
  });

  function setupSuccessChangeRole() {
    const user = User.create('username', 'passwordHash');
    userCachePort.get.mockResolvedValue(null);
    userRepositoryPort.findById.mockResolvedValue(user);
    userRepositoryPort.save.mockImplementation((user) => Promise.resolve(user));
  }

  function setupUserNotFoundError() {
    userCachePort.get.mockResolvedValue(null);
    userRepositoryPort.findById.mockResolvedValue(null);
  }

  function setupUnexpectedRoleActionError() {
    const user = new User(
      'adminId',
      '',
      '',
      UserRole.USER,
      new Date(),
      new RoleAssignmentHistory([]),
      new ModerationActionHistory([]),
    );
    userCachePort.get.mockResolvedValue(null);
    userRepositoryPort.findById.mockResolvedValue(user);
  }

  function setupUserRoleAlreadyAssignedError() {
    const user = new User(
      'userId',
      '',
      '',
      UserRole.MODERATOR,
      new Date(),
      new RoleAssignmentHistory([]),
      new ModerationActionHistory([]),
    );
    userCachePort.get.mockResolvedValue(null);
    userRepositoryPort.findById.mockResolvedValue(user);
  }
});
