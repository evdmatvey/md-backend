import { UserRole } from '../enums';
import { DomainError } from './domain.error';

export class UserRoleAlreadyAssignedError extends DomainError {
  public constructor(role: UserRole) {
    super(`Пользователь уже имеет роль "${role}".`);
  }
}

export class UserUnexpectedBanActionError extends DomainError {
  public constructor(isBanned: boolean) {
    const message = isBanned
      ? 'Пользователь уже заблокирован.'
      : 'Пользователь ещё не заблокирован.';
    super(message);
  }
}
