import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, BeforeInsert } from 'typeorm';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { uuidv7 } from 'uuidv7';

@Entity('verification_tokens')
export class VerificationToken {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  token!: string;

  @ManyToOne(() => UserEntity)
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
