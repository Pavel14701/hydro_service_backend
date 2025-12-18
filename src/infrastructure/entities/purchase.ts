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
import { decimalTransformer } from './utils';
import { UserEntity } from './user';
import { DiscountEntity } from './discount';



// -------------------- Purchase --------------------
@Entity('purchases')
export class PurchaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  serviceId!: string;

  @Column({ type: 'uuid', nullable: true })
  discountId?: string;

  @ManyToOne(() => UserEntity, (user) => user.purchases, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @ManyToOne(() => ServiceEntity, { nullable: false })
  @JoinColumn({ name: 'serviceId' })
  service!: ServiceEntity;

  @ManyToOne(() => DiscountEntity, { nullable: true })
  @JoinColumn({ name: 'discountId' })
  discount?: DiscountEntity;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  amount!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchasedAt!: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}
