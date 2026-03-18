import { DomainError } from './domain.error';

export class SessionNotFoundError extends DomainError {
  public constructor(id: string) {
    super(`Сессия не найдена по id ${id}.`);
  }
}
