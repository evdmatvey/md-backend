import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModerationActionType } from '@/domains/enums';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_bans' })
export class UserBanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column({ type: 'enum', enum: ModerationActionType })
  type: ModerationActionType;

  @Column()
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.bans, {
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
