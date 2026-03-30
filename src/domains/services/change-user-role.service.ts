import { User } from '../entities';
import { UserRole } from '../enums';
import {
  UnexpectedRoleActionError,
  UserNotFoundError,
  UserRoleAlreadyAssignedError,
} from '../errors';
import { ChangeUserRoleCommand, ChangeUserRoleUseCase } from '../ports/in';
import { UserCachePort, UserRepositoryPort } from '../ports/out';

export class ChangeUserRoleService implements ChangeUserRoleUseCase {
  public constructor(
    private readonly _userRepository: UserRepositoryPort,
    private readonly _userCache: UserCachePort,
  ) {}

  public async execute(command: ChangeUserRoleCommand): Promise<User> {
    const { userId, role, adminId, reason } = command;
    const user = await this._getUserById(userId);

    if (!user) throw new UserNotFoundError({ id: userId });
    if (user.id === adminId) throw new UnexpectedRoleActionError();
    if (user.role === role) throw new UserRoleAlreadyAssignedError(role);

    if (role === UserRole.ADMIN) user.promoteToAdmin(adminId, reason);
    if (role === UserRole.MODERATOR) user.promoteToModerator(adminId, reason);
    if (role === UserRole.USER) user.demoteToUser(adminId, reason);

    const updatedUser = await this._userRepository.save(user);
    await this._userCache.set(user.id, updatedUser);

    return updatedUser;
  }

  private async _getUserById(userId: string): Promise<User | null> {
    const cached = await this._userCache.get(userId);
    if (cached) return cached;

    const user = await this._userRepository.findById(userId);
    return user;
  }
}
