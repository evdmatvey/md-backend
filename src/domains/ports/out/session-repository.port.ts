import { Session } from '@/domains/entities';

export interface SessionRepositoryPort {
  save(session: Session): Promise<Session>;
  getById(id: string): Promise<Session | null>;
  getAllByUserId(userId: string): Promise<Session[]>;
  delete(id: string): Promise<void>;
}
