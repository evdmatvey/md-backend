import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '@/domains/enums';
import { RoleAssignmentEntity } from './role-assignment.entity';
import { UserBanEntity } from './user-ban.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => RoleAssignmentEntity, (assignment) => assignment.user, {
    onDelete: 'CASCADE',
  })
  roleAssignments: RoleAssignmentEntity[];

  @OneToMany(() => UserBanEntity, (ban) => ban.user, {
    onDelete: 'CASCADE',
  })
  bans: UserBanEntity[];
}
