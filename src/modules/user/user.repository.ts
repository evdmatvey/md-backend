import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from '@/domains/entities';
import { UserNotFoundError } from '@/domains/errors';
import { UserRepositoryPort } from '@/domains/ports/out';
import { RoleAssignmentEntity } from './entities/role-assignment.entity';
import { UserBanEntity } from './entities/user-ban.entity';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './user.mapper';

export class UserRepository implements UserRepositoryPort {
  public constructor(
    @InjectDataSource()
    private readonly _dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  public async findAll(): Promise<User[]> {
    const users = await this._userRepository.find({
      relations: {
        bans: true,
        roleAssignments: true,
      },
    });

    return users.map((user) => UserMapper.mapToDomain(user));
  }

  public async findById(userId: string): Promise<User | null> {
    const user = await this._userRepository.findOne({
      where: { id: userId },
      relations: {
        bans: true,
        roleAssignments: true,
      },
    });

    if (!user) return null;

    return UserMapper.mapToDomain(user);
  }

  public async findByUsername(username: string): Promise<User | null> {
    const user = await this._userRepository.findOne({
      where: { username },
      relations: {
        bans: true,
        roleAssignments: true,
      },
    });

    if (!user) return null;

    return UserMapper.mapToDomain(user);
  }

  public async save(user: User): Promise<User> {
    if (user.isNew()) {
      return this._create(user);
    } else {
      return this._update(user);
    }
  }

  private async _create(user: User): Promise<User> {
    const created = this._userRepository.create({
      username: user.username,
      passwordHash: user.passwordHash,
      role: user.role,
    });

    await this._userRepository.save(created);

    return UserMapper.mapToDomain(created);
  }

  private async _update(user: User): Promise<User> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepository = queryRunner.manager.getRepository(UserEntity);

      const existingEntity = await userRepository.findOne({
        where: { id: user.id },
      });

      if (!existingEntity) throw new UserNotFoundError({ id: user.id });

      existingEntity.username = user.username;
      existingEntity.passwordHash = user.passwordHash;
      existingEntity.role = user.role;

      if (user.isBanHistoryUpdated) {
        await this._saveNewBan(user, queryRunner);
      }

      if (user.isAssignmentHistoryUpdated) {
        await this._saveNewRoleAssignment(user, queryRunner);
      }

      await userRepository.save(existingEntity);
      const updated = await userRepository.findOne({
        where: { id: user.id },
        relations: { bans: true, roleAssignments: true },
      });

      if (!updated) throw new UserNotFoundError({ id: user.id });

      await queryRunner.commitTransaction();

      return UserMapper.mapToDomain(updated);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async _saveNewBan(
    user: User,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const newBan = user.banHistory.at(-1);

    if (!newBan) return;

    const userBanRepository = queryRunner.manager.getRepository(UserBanEntity);

    const ban = userBanRepository.create({
      userId: user.id,
      adminId: newBan.moderatorId,
      type: newBan.type,
      reason: newBan.reason,
    });

    await userBanRepository.save(ban);
  }

  private async _saveNewRoleAssignment(
    user: User,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const newAssignment = user.assignmentHistory.at(-1);

    if (!newAssignment) return;

    const roleAssignmentRepository =
      queryRunner.manager.getRepository(RoleAssignmentEntity);

    const assignment = roleAssignmentRepository.create({
      userId: user.id,
      adminId: newAssignment.assignedBy,
      reason: newAssignment.reason,
      role: user.role,
    });

    await roleAssignmentRepository.save(assignment);
  }
}
