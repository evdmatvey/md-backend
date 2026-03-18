import { DomainError } from './domain.error';

export class SessionNotFoundError extends DomainError {
  public constructor(id: string) {
    super(`Сессия не найдена по id ${id}.`);
  }
}

export class SessionMismatchError extends DomainError {
  public constructor() {
    super('Сессия не совпадает с полученными данными.');
  }
}

export class SessionExpiredError extends DomainError {
  public constructor() {
    super('Текущая сессия уже истекла.');
  }
}

export class SessionTokensMismatchError extends DomainError {
  public constructor() {
    super('Токен не совпал с токеном сессии.');
  }
}
