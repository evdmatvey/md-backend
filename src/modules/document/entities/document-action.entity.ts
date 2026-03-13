import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { DocumentActionType } from '../types/document-action-type.type';
import { DocumentEntity } from './document.entity';

@Entity({ name: 'document_actions' })
export class DocumentActionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ name: 'document_id' })
  documentId: string;

  @Column()
  type: DocumentActionType;

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
