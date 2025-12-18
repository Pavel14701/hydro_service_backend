import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from './user';



// -------------------- VerificationToken --------------------
@Entity('verification_tokens')
export class VerificationTokenEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  token!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: false })
  used!: boolean;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}
