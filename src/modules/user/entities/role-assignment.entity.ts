import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '@/domains/enums';
import { UserEntity } from './user.entity';

@Entity({ name: 'role_assignments' })
export class RoleAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'admin_id' })
  adminId: string;

  @Column()
  reason: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.roleAssignments, {
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
