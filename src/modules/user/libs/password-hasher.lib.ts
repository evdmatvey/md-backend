import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PasswordHasherPort } from '@/domains/ports/out';

@Injectable()
export class PasswordHasher implements PasswordHasherPort {
  private readonly _options: argon2.Options;

  public constructor(private readonly _configService: ConfigService) {
    this._options = {
      type: argon2.argon2id,
      memoryCost: +this._configService.getOrThrow<number>('ARGON_MEMORY_COST'),
      timeCost: +this._configService.getOrThrow<number>('ARGON_TIME_COST'),
      parallelism: +this._configService.getOrThrow<number>('ARGON_PARALLELISM'),
      hashLength: +this._configService.getOrThrow<number>('ARGON_HASH_LENGTH'),
    };
  }

  public async hash(password: string): Promise<string> {
    return argon2.hash(password, this._options);
  }

  public async verify(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }
}
