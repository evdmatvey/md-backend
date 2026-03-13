import { Catch } from '@nestjs/common';
import {
  DocumentBannedError,
  DocumentNotFoundError,
  DocumentUnexpectedActionError,
} from '@/domains/errors/document.error';
import { DomainError } from '@/domains/errors/domain.error';
import { DomainErrorFilter } from '@/modules/filters/domain-error.filter';

@Catch(
  DocumentNotFoundError,
  DocumentBannedError,
  DocumentUnexpectedActionError,
)
export class DocumentErrorFilter extends DomainErrorFilter<DomainError> {
  protected getHttpStatus(exception: DomainError): number {
    if (exception instanceof DocumentBannedError) return 403;
    if (exception instanceof DocumentNotFoundError) return 404;
    if (exception instanceof DocumentUnexpectedActionError) return 409;
    return 500;
  }

  protected getErrorCode(exception: DomainError): string {
    if (exception instanceof DocumentBannedError) return 'DOCUMENT_BANNED';
    if (exception instanceof DocumentNotFoundError) return 'DOCUMENT_NOT_FOUND';
    if (exception instanceof DocumentUnexpectedActionError)
      return 'DOCUMENT_UNEXPECTED_ACTION';
    return 'INTERNAL_ERROR';
  }

  protected getAdditionalResponse(exception: DomainError): Record<string, any> {
    if (exception instanceof DocumentBannedError)
      return {
        reason: exception.reason,
        slug: exception.slug,
        occurredAt: exception.occurredAt,
      };

    return {};
  }
}
