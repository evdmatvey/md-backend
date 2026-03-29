import { Catch } from '@nestjs/common';
import { TokenExpiredError } from '@nestjs/jwt';
import {
  DomainError,
  NoAccessError,
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
  NoAccessError,
  TokenExpiredError,
)
export class AuthTokenErrorFilter extends DomainErrorFilter<DomainError> {
  protected getHttpStatus(exception: DomainError): number {
    if (exception instanceof UserBannedError) return 403;
    if (exception instanceof SessionMismatchError) return 403;
    if (exception instanceof SessionTokenError) return 401;
    if (exception instanceof NoAccessError) return 401;
    if (exception instanceof TokenExpiredError) return 401;
    return 500;
  }

  protected getErrorCode(exception: DomainError): string {
    if (exception instanceof UserBannedError) return 'USER_BANNED';
    if (exception instanceof SessionMismatchError) return 'SESSION_MISMATCH';
    if (exception instanceof SessionTokenError) return 'INVALID_TOKEN';
    if (exception instanceof NoAccessError) return 'NO_ACCESS';
    if (exception instanceof TokenExpiredError) return 'TOKEN_EXPIRED';
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
