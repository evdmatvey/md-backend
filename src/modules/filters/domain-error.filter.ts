import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '@/domains/errors/domain.error';

export abstract class DomainErrorFilter<T extends DomainError>
  implements ExceptionFilter
{
  protected abstract getHttpStatus(exception: T): number;
  protected abstract getErrorCode(exception: T): string;
  protected abstract getAdditionalResponse(exception: T): Record<string, any>;

  public catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const additionalResponse = this.getAdditionalResponse(exception);
    const status = this.getHttpStatus(exception);
    const errorCode = this.getErrorCode(exception);

    response.status(status).json({
      statusCode: status,
      error: errorCode,
      message: exception.message,
      ...additionalResponse,
    });
  }
}
