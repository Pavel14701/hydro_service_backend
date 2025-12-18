import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { ServiceEntity } from './service';
import { UserEntity } from './user';



// -------------------- Cart --------------------
@Entity('cart')
export class CartEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  serviceId!: string;

  @ManyToOne(() => UserEntity, (user) => user.cart, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => ServiceEntity, { nullable: false })
  @JoinColumn({ name: 'serviceId' })
  service!: ServiceEntity;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}
