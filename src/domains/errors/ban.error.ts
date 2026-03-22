import { DomainError } from './domain.error';

export class CannotBanYourselfError extends DomainError {
  public constructor() {
    super('Вы не можете заблокировать себя!');
  }
}

export class CannotUnbanYourselfError extends DomainError {
  public constructor() {
    super('Вы не можете разблокировать себя!');
  }
}
