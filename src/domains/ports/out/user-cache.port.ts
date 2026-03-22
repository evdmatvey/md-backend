import { User } from '@/domains/entities';

export interface UserCachePort {
  get(userId: string): Promise<User | null>;
  set(userId: string, user: User): Promise<void>;
  delete(userId: string): Promise<void>;
}
