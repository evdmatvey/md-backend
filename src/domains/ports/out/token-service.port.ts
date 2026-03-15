import { TokenPayload, Tokens } from '@/domains/types';

export interface TokenServicePort {
  generatePair(payload: TokenPayload): Promise<Tokens>;
  verify(token: string): Promise<TokenPayload>;
}
