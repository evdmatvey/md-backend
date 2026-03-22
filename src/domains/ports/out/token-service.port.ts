import { TokenPayload, Tokens } from '@/domains/types';

export interface TokenServicePort {
  generatePair(payload: TokenPayload): Promise<Tokens>;
  verifyRefreshToken(token: string): Promise<TokenPayload>;
}
