export interface TokenHasherPort {
  hash(token: string): Promise<string>;
  verify(token: string, hashedToken: string): Promise<boolean>;
}
