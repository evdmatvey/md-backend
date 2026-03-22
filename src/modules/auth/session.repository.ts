import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '@/domains/entities';
import { SessionNotFoundError } from '@/domains/errors';
import { SessionRepositoryPort } from '@/domains/ports/out';
import { SessionEntity } from './entities/session.entity';
import { SessionMapper } from './session.mapper';

@Injectable()
export class SessionRepository implements SessionRepositoryPort {
  public constructor(
    @InjectRepository(SessionEntity)
    private readonly _sessionRepository: Repository<SessionEntity>,
  ) {}

  public async findById(id: string): Promise<Session | null> {
    const session = await this._sessionRepository.findOne({ where: { id } });

    if (!session) return null;

    return SessionMapper.mapToDomain(session);
  }

  public async findAllByUserId(userId: string): Promise<Session[]> {
    const sessions = await this._sessionRepository.find({ where: { userId } });

    return sessions.map((session) => SessionMapper.mapToDomain(session));
  }

  public async delete(id: string): Promise<void> {
    await this._sessionRepository.delete({ id });
  }

  public async save(session: Session): Promise<Session> {
    if (session.isNew()) {
      return this._create(session);
    } else {
      return this._update(session);
    }
  }

  private async _create(session: Session): Promise<Session> {
    const created = this._sessionRepository.create();

    created.userId = session.userId;
    created.isRevoked = session.isRevoked;
    created.refreshTokenHash = session.refreshTokenHash;
    created.lastUsedAt = session.lastUsedAt;
    created.expiresAt = session.expiresAt;
    created.browser = session.deviceInfo.browser;
    created.os = session.deviceInfo.os;

    await this._sessionRepository.save(created);

    return SessionMapper.mapToDomain(created);
  }

  private async _update(session: Session): Promise<Session> {
    const existingEntity = await this._sessionRepository.findOne({
      where: { id: session.id },
    });

    if (!existingEntity) throw new SessionNotFoundError(session.id);

    existingEntity.userId = session.userId;
    existingEntity.isRevoked = session.isRevoked;
    existingEntity.refreshTokenHash = session.refreshTokenHash;
    existingEntity.lastUsedAt = session.lastUsedAt;
    existingEntity.expiresAt = session.expiresAt;
    existingEntity.browser = session.deviceInfo.browser;
    existingEntity.os = session.deviceInfo.os;

    const updated = await this._sessionRepository.save(existingEntity);

    return SessionMapper.mapToDomain(updated);
  }
}
