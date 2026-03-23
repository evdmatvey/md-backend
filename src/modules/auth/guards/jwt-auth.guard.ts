import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Session, User } from '@/domains/entities';
import {
  NoAccessError,
  SessionMismatchError,
  SessionTokenError,
  UserBannedError,
} from '@/domains/errors';
import { UserCache, UserRepository } from '@/modules/user';
import { SessionCache } from '../libs/session-cache.lib';
import { TokenService } from '../libs/token-service.lib';
import { SessionRepository } from '../session.repository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public constructor(
    private readonly _tokenService: TokenService,
    private readonly _userRepository: UserRepository,
    private readonly _sessionRepository: SessionRepository,
    private readonly _userCache: UserCache,
    private readonly _sessionCache: SessionCache,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this._extractTokenFromRequest(request);

    const { sessionId, userId } =
      await this._tokenService.verifyAccessToken(token);

    const session = await this._getSessionById(sessionId);
    if (!session) throw new SessionTokenError();
    if (session.isRevoked) throw new SessionTokenError();
    if (session.userId !== userId) throw new SessionMismatchError();

    const user = await this._getUserById(userId);
    if (!user) throw new SessionTokenError();
    if (user?.isBanned)
      throw new UserBannedError(
        user.username,
        user.currentBan!.reason,
        user.currentBan!.occurredAt,
      );

    request.user = user;
    await this._sessionRepository.updateSessionLastUsedAt(sessionId);

    return true;
  }

  private _extractTokenFromRequest(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new NoAccessError();

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) throw new NoAccessError();

    return token;
  }

  private async _getUserById(userId: string): Promise<User | null> {
    const cached = await this._userCache.get(userId);
    if (cached) return cached;

    const user = await this._userRepository.findById(userId);
    if (!user) return null;

    await this._userCache.set(userId, user);

    return user;
  }

  private async _getSessionById(sessionId: string): Promise<Session | null> {
    const cached = await this._sessionCache.get(sessionId);
    if (cached) return cached;

    const session = await this._sessionRepository.findById(sessionId);
    if (!session) return null;

    await this._sessionCache.set(sessionId, session);

    return session;
  }
}
