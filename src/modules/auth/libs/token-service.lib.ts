import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SESSION_CONSTANTS } from '@/domains/constants';
import { SessionTokenError } from '@/domains/errors';
import { TokenServicePort } from '@/domains/ports/out';
import { TokenPayload, Tokens } from '@/domains/types';

@Injectable()
export class TokenService implements TokenServicePort {
  public constructor(
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  public async generatePair(payload: TokenPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this._generateAccessToken(payload),
      this._generateRefreshToken(payload),
    ]);

    return { access: accessToken, refresh: refreshToken };
  }

  public async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return this._jwtService.verifyAsync<TokenPayload>(token, {
        secret: this._configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new SessionTokenError();
    }
  }

  public async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      return this._jwtService.verifyAsync<TokenPayload>(token, {
        secret: this._configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new SessionTokenError();
    }
  }

  private async _generateAccessToken(payload: TokenPayload): Promise<string> {
    return this._jwtService.signAsync(payload, {
      secret: this._configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: SESSION_CONSTANTS.accessTokenExpiresIn,
    });
  }

  private async _generateRefreshToken(payload: TokenPayload): Promise<string> {
    return this._jwtService.signAsync(payload, {
      secret: this._configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: SESSION_CONSTANTS.refreshTokenExpiresIn,
    });
  }
}
