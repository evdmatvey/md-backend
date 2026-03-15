import { User } from '@/domains/entities/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}
