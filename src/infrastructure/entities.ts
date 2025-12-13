import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';


const decimalTransformer = {
  to: (value: number): number => value,
  from: (value: string): number => parseFloat(value),
};


@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 100 })
  name!: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}

@Entity('subcategories')
export class SubcategoryEntity {
  @PrimaryColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 100 })
  name!: string;
  @ManyToOne(() => CategoryEntity, { nullable: false })
  category!: CategoryEntity;
  @Column({ type: 'uuid' })
  categoryId!: string;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}

@Entity('services')
export class ServiceEntity {
  @PrimaryColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 255 })
  title!: string;
  @Column({ type: 'text' })
  description!: string;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  price?: number;
  @Column({ type: 'text', array: true })
  mediaLinks?: string[];
  @ManyToOne(() => CategoryEntity, { nullable: false })
  category!: CategoryEntity;
  @ManyToMany(() => SubcategoryEntity)
  @JoinTable()
  subcategories!: SubcategoryEntity[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}

@Entity('purchases')
export class PurchaseEntity {
  @PrimaryColumn('uuid')
  id!: string;
  @ManyToOne(() => UserEntity, user => user.purchases, { nullable: false })
  user!: UserEntity;
  @ManyToOne(() => ServiceEntity, { nullable: false })
  service!: ServiceEntity;
  @ManyToOne(() => DiscountEntity, { nullable: true })
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




@Entity('cart')
export class CartEntity {
  @PrimaryColumn('uuid')
  id!: string;
  @ManyToOne(() => UserEntity, user => user.cart, { nullable: false })
  user!: UserEntity;
  @ManyToOne(() => ServiceEntity, { nullable: false })
  service!: ServiceEntity;
  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}


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


@Entity('verification_tokens')
export class VerificationTokenEntity {
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
  @ManyToOne(() => ServiceEntity, { nullable: true })
  service?: ServiceEntity;
  @ManyToOne(() => UserEntity, { nullable: true })
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
