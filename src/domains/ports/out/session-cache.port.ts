import { Session } from '@/domains/entities';

export interface SessionCachePort {
  get(sessionId: string): Promise<Session | null>;
  set(sessionId: string, session: Session): Promise<void>;
  delete(sessionId: string): Promise<void>;
}
