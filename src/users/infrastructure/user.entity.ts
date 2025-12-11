import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  BeforeInsert, 
  OneToMany 
} from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { CartEntity } from '../../cart/infrastructure/entities';
import { PurchaseEntity } from '../../purchases/infrastructure/entities';

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

  @OneToMany(() => CartEntity, cart => cart.user)
  cart!: CartEntity[];

  @OneToMany(() => PurchaseEntity, purchase => purchase.user)
  purchases!: PurchaseEntity[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}
