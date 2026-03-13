import { DomainError } from './domain.error';

export class DocumentNotFoundError extends DomainError {
  public readonly identifierType: 'id' | 'slug';
  public readonly identifierValue: string;

  public constructor(identifier: { id: string } | { slug: string }) {
    const [type, value] =
      'id' in identifier ? ['id', identifier.id] : ['slug', identifier.slug];

    super(`Документ по ${type} "${value}" не найден.`);
  }
}

export class DocumentUnexpectedActionError extends DomainError {
  public constructor(isBanned: boolean) {
    const message = isBanned
      ? 'Документ уже заблокирован.'
      : 'Документ ещё не заблокирован.';
    super(message);
  }
}

export class DocumentNotUniqueSlugError extends DomainError {}

export class DocumentBannedError extends DomainError {
  public constructor(
    public readonly slug: string,
    public readonly reason: string,
    public readonly occurredAt: Date,
  ) {
    super(`Документ "${slug}" заблокирован.`);
  }
}
