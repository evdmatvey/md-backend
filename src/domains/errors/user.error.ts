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

export class UserAlreadyExistError extends DomainError {
  public constructor(username: string) {
    super(`Пользователь с именем ${username} уже существует.`);
  }
}

export class UserNotFoundError extends DomainError {
  public readonly identifierType: 'id' | 'username';
  public readonly identifierValue: string;

  public constructor(identifier: { id: string } | { username: string }) {
    const [type, value] =
      'id' in identifier
        ? ['id', identifier.id]
        : ['имени', identifier.username];

    super(`Пользователь по ${type} "${value}" не найден.`);
  }
}

export class UserPasswordMismatchError extends DomainError {
  public constructor() {
    super('Неверный логин или пароль.');
  }
}

export class UserBannedError extends DomainError {
  public constructor(
    public readonly username: string,
    public readonly reason: string,
    public readonly occurredAt: Date,
  ) {
    super(`Пользователь "${username}" заблокирован.`);
  }
}

export class UnexpectedRoleActionError extends DomainError {
  public constructor() {
    super('Вы не можете назначить себе новую роль.');
  }
}
