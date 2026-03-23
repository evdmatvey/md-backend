import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@/domains/enums';
import { NoAccessError } from '@/domains/errors';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  public constructor(private readonly _reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this._reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler, context.getClass],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new NoAccessError();

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) throw new NoAccessError();

    return true;
  }
}
