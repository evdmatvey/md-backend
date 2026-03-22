import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { TokenHasherPort } from '@/domains/ports/out';

@Injectable()
export class TokenHasher implements TokenHasherPort {
  private readonly _options: argon2.Options;

  public constructor(private readonly _configService: ConfigService) {
    this._options = {
      type: argon2.argon2id,
      memoryCost: +this._configService.getOrThrow<number>('TOKEN_MEMORY_COST'),
      timeCost: +this._configService.getOrThrow<number>('TOKEN_TIME_COST'),
      parallelism: +this._configService.getOrThrow<number>('TOKEN_PARALLELISM'),
      hashLength: +this._configService.getOrThrow<number>('TOKEN_HASH_LENGTH'),
    };
  }

  public async hash(token: string): Promise<string> {
    return argon2.hash(token, this._options);
  }

  public async verify(token: string, hashedToken: string): Promise<boolean> {
    return argon2.verify(hashedToken, token);
  }
}
