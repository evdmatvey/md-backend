import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  SessionMismatchResponse,
  SessionTokensMismatchResponse,
} from '@/modules/auth/responses';

export const ApiAuthErrorResponses = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description:
        'Ошибки авторизации (401). Появляется при попытке использования невалидного токена или при отсутствии требуемой роли',
      type: SessionTokensMismatchResponse,
    }),
    ApiForbiddenResponse({
      description:
        'Ошибки доступа (403). Появляется если пользователь не совпадает с пользователем сессии из токена или при попытке использования токена заблокированного аккаунта',
      type: SessionMismatchResponse,
    }),
  );
};
