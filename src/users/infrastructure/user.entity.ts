import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

}
