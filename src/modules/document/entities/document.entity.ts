import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentActionEntity } from './document-action.entity';

@Entity({ name: 'documents' })
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  markdown: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => DocumentActionEntity, (action) => action.document, {
    onDelete: 'CASCADE',
    eager: true,
  })
  actions: DocumentActionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
