import { User } from '../entities';
import { Tokens } from './token.type';

export type AuthResult = {
  user: User;
  tokens: Tokens;
};
