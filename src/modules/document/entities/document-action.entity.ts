import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModerationActionType } from '@/domains/enums';
import { DocumentEntity } from './document.entity';

@Entity({ name: 'document_actions' })
export class DocumentActionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ name: 'document_id' })
  documentId: string;

  @Column({
    type: 'enum',
    enum: ModerationActionType,
  })
  type: ModerationActionType;

  @Column()
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => DocumentEntity, (document) => document.actions, {
    eager: false,
  })
  @JoinColumn({ name: 'document_id' })
  document: DocumentEntity;
}
