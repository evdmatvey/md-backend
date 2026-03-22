import { Catch } from '@nestjs/common';
import {
  DomainError,
  SessionExpiredError,
  SessionMismatchError,
  SessionNotFoundError,
  SessionTokenError,
  SessionTokensMismatchError,
  UserAlreadyExistError,
  UserBannedError,
  UserNotFoundError,
  UserPasswordMismatchError,
} from '@/domains/errors';
import { DomainErrorFilter } from '@/modules/shared/filters';

@Catch(
  UserAlreadyExistError,
  UserPasswordMismatchError,
  UserNotFoundError,
  UserBannedError,
  SessionNotFoundError,
  SessionMismatchError,
  SessionExpiredError,
  SessionTokensMismatchError,
  SessionTokenError,
)
export class AuthErrorFilter extends DomainErrorFilter<DomainError> {
  protected getHttpStatus(exception: DomainError): number {
    if (exception instanceof UserAlreadyExistError) return 409;
    if (exception instanceof UserPasswordMismatchError) return 401;
    if (exception instanceof UserNotFoundError) return 404;
    if (exception instanceof UserBannedError) return 403;
    if (exception instanceof SessionNotFoundError) return 404;
    if (exception instanceof SessionMismatchError) return 403;
    if (exception instanceof SessionExpiredError) return 401;
    if (exception instanceof SessionTokensMismatchError) return 401;
    if (exception instanceof SessionTokenError) return 401;
    return 500;
  }

  protected getErrorCode(exception: DomainError): string {
    if (exception instanceof UserAlreadyExistError) return 'USER_ALREADY_EXIST';
    if (exception instanceof UserPasswordMismatchError)
      return 'INCORRECT_LOGIN_OR_PASSWORD';
    if (exception instanceof UserNotFoundError) return 'USER_NOT_FOUND';
    if (exception instanceof UserBannedError) return 'USER_BANNED';
    if (exception instanceof SessionNotFoundError) return 'SESSION_NOT_FOUND';
    if (exception instanceof SessionMismatchError) return 'SESSION_MISMATCH';
    if (exception instanceof SessionExpiredError) return 'SESSION_EXPIRED';
    if (exception instanceof SessionTokensMismatchError)
      return 'SESSION_TOKENS_MISMATCH';
    if (exception instanceof SessionTokenError) return 'INVALID_TOKEN';
    return 'INTERNAL_ERROR';
  }

  protected getAdditionalResponse(exception: DomainError): Record<string, any> {
    if (exception instanceof UserBannedError)
      return {
        reason: exception.reason,
        occurredAt: exception.occurredAt,
      };

    return {};
  }
}
