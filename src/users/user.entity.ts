import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}
