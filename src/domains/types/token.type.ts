export type TokenType = 'access' | 'refresh';

export type Tokens = Record<TokenType, string>;

export type TokenPayload = {
  userId: string;
  sessionId: string;
};
