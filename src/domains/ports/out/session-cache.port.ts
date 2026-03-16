import { Session } from '@/domains/entities';

export interface SessionCachePort {
  get(key: string): Promise<Session | null>;
  set(key: string, session: Session): Promise<void>;
  delete(key: string): Promise<void>;
}
