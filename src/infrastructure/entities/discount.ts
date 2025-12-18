import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { decimalTransformer } from './utils';
import { ServiceEntity } from './service';
import { UserEntity } from './user';


// -------------------- Discount --------------------
@Entity('discounts')
export class DiscountEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'enum', enum: ['PERCENT', 'FIXED'] })
  type!: 'PERCENT' | 'FIXED';

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  value!: number;

  @Column({ type: 'enum', enum: ['SERVICE', 'CART', 'USER'] })
  scope!: 'SERVICE' | 'CART' | 'USER';

  @Column({ type: 'uuid', nullable: true })
  serviceId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ManyToOne(() => ServiceEntity, { nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service?: ServiceEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column({ type: 'timestamp', nullable: true })
  validFrom?: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil?: Date;

  @Column({ type: 'boolean', default: false })
  firstPurchaseOnly!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}