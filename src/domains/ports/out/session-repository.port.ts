import { Session } from '@/domains/entities';

export interface SessionRepositoryPort {
  save(session: Session): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  findAllByUserId(userId: string): Promise<Session[]>;
  delete(id: string): Promise<void>;
}
