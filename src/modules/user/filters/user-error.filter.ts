import { Catch } from '@nestjs/common';
import {
  DomainError,
  UnexpectedRoleActionError,
  UserBannedError,
  UserNotFoundError,
} from '@/domains/errors';
import { DomainErrorFilter } from '@/modules/shared/filters';

@Catch(UserNotFoundError, UserBannedError, UnexpectedRoleActionError)
export class UserErrorFilter extends DomainErrorFilter<DomainError> {
  protected getHttpStatus(exception: DomainError): number {
    if (exception instanceof UserNotFoundError) return 404;
    if (exception instanceof UserBannedError) return 403;
    if (exception instanceof UnexpectedRoleActionError) return 403;
    return 500;
  }

  protected getErrorCode(exception: DomainError): string {
    if (exception instanceof UserNotFoundError) return 'USER_NOT_FOUND';
    if (exception instanceof UserBannedError) return 'USER_BANNED';
    if (exception instanceof UnexpectedRoleActionError)
      return 'UNEXPECTED_ROLE_ACTION';
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
