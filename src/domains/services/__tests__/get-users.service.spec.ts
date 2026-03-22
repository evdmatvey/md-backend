import {
  ModerationActionHistory,
  RoleAssignmentHistory,
  User,
} from '@/domains/entities';
import { UserRole } from '@/domains/enums';
import { GetUsersQuery } from '@/domains/ports/in';
import { UserRepositoryPort } from '@/domains/ports/out';
import { GetUsersService } from '../get-users.service';

describe('GetUsersService', () => {
  let userRepositoryPort: jest.Mocked<UserRepositoryPort>;
  let getUsersService: GetUsersService;

  beforeEach(() => {
    userRepositoryPort = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
    } as jest.Mocked<UserRepositoryPort>;

    getUsersService = new GetUsersService(userRepositoryPort);
  });

  it('Should return all users without filters', async () => {
    setupWithoutFilters();

    const query = new GetUsersQuery();
    const users = await getUsersService.execute(query);

    expect(users.length).toBe(3);
  });

  it('Should return users with similar usernames', async () => {
    setupWithUsernameFilter();

    const query = new GetUsersQuery('admin');
    const users = await getUsersService.execute(query);

    expect(users.length).toBe(2);
  });

  it('Should return users with same role', async () => {
    setupWithRoleFilter();

    const query = new GetUsersQuery('', UserRole.MODERATOR);
    const users = await getUsersService.execute(query);

    expect(users.length).toBe(1);
  });

  it('Should return users with ban', async () => {
    setupWithBannedFilter();

    const query = new GetUsersQuery('', undefined, 'banned');
    const users = await getUsersService.execute(query);

    expect(users.length).toBe(1);
  });

  it('Should return users without ban', async () => {
    setupWithBannedFilter();

    const query = new GetUsersQuery('', undefined, 'active');
    const users = await getUsersService.execute(query);

    expect(users.length).toBe(2);
  });

  it('Should return all users if user status all', async () => {
    setupWithBannedFilter();

    const query = new GetUsersQuery('', undefined, 'all');
    const users = await getUsersService.execute(query);

    expect(users.length).toBe(3);
  });

  it('Should return users by createdAt range', async () => {
    setupWithCreatedAtRangeFilter();

    const query = new GetUsersQuery(
      '',
      undefined,
      undefined,
      new Date('2025-01-01'),
      new Date('2026-01-01'),
    );
    const users = await getUsersService.execute(query);

    expect(users.length).toBe(2);
  });

  it('Should return users with several filters', async () => {
    setupWithSeveralFilters();

    const query = new GetUsersQuery('adm', UserRole.ADMIN);
    const users = await getUsersService.execute(query);

    expect(users.length).toBe(2);
  });

  function setupWithoutFilters() {
    const user1 = User.create('admin', 'passwordHash');
    const user2 = User.create('moderator', 'passwordHash');
    const user3 = User.create('user', 'passwordHash');

    userRepositoryPort.findAll.mockResolvedValue([user1, user2, user3]);
  }

  function setupWithUsernameFilter() {
    const user1 = User.create('admin', 'passwordHash');
    const user2 = User.create('administrator', 'passwordHash');
    const user3 = User.create('user', 'passwordHash');

    userRepositoryPort.findAll.mockResolvedValue([user1, user2, user3]);
  }

  function setupWithRoleFilter() {
    const user1 = User.create('admin', 'passwordHash');
    const user2 = User.create('moderator', 'passwordHash');
    const user3 = User.create('user', 'passwordHash');
    user1.promoteToAdmin('admin', '');
    user2.promoteToModerator('admin', '');

    userRepositoryPort.findAll.mockResolvedValue([user1, user2, user3]);
  }

  function setupWithBannedFilter() {
    const user1 = User.create('admin', 'passwordHash');
    const user2 = User.create('moderator', 'passwordHash');
    const user3 = User.create('user', 'passwordHash');
    user3.ban('admin', '');

    userRepositoryPort.findAll.mockResolvedValue([user1, user2, user3]);
  }

  function setupWithCreatedAtRangeFilter() {
    const user1 = User.create('admin', 'passwordHash');
    const user2 = User.create('moderator', 'passwordHash');
    const user3 = new User(
      'id',
      'old_user',
      'passwordHash',
      UserRole.USER,
      new Date('2025-05-01'),
      new RoleAssignmentHistory([]),
      new ModerationActionHistory([]),
    );
    const user4 = new User(
      'id',
      'old_user2',
      'passwordHash',
      UserRole.USER,
      new Date('2025-01-01'),
      new RoleAssignmentHistory([]),
      new ModerationActionHistory([]),
    );

    userRepositoryPort.findAll.mockResolvedValue([user1, user4, user2, user3]);
  }

  function setupWithSeveralFilters() {
    const user1 = User.create('admin', 'passwordHash');
    const user2 = User.create('administrator', 'passwordHash');
    const user3 = User.create('user', 'passwordHash');
    user1.promoteToAdmin('admin', '');
    user2.promoteToAdmin('admin', '');

    userRepositoryPort.findAll.mockResolvedValue([user1, user2, user3]);
  }
});
