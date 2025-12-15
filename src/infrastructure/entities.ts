import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

const decimalTransformer = {
  to: (value?: number | null): number | null => value ?? null,
  from: (value?: string | null): number | null => value == null ? null : parseFloat(value),
};

// -------------------- Category --------------------
@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @OneToMany(() => SubcategoryEntity, sub => sub.category)
  subcategories!: SubcategoryEntity[];

  @OneToMany(() => ServiceEntity, service => service.category)
  services!: ServiceEntity[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}

// -------------------- Subcategory --------------------
@Entity('subcategories')
export class SubcategoryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => CategoryEntity, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;

  @ManyToMany(() => ServiceEntity, service => service.subcategories)
  services!: ServiceEntity[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}

// -------------------- Service --------------------
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
    nullable: true,
  })
  price?: number | null;

  @Column({ type: 'text', array: true })
  mediaLinks?: string[];

  @Column({ type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => CategoryEntity, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;

  @ManyToMany(() => SubcategoryEntity, sub => sub.services)
  @JoinTable({
    name: 'service_subcategories',
    joinColumn: { name: 'serviceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subcategoryId', referencedColumnName: 'id' },
  })
  subcategories!: SubcategoryEntity[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}

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

  @ManyToOne(() => UserEntity, user => user.purchases, { nullable: false })
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

// -------------------- Cart --------------------
@Entity('cart')
export class CartEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  serviceId!: string;

  @ManyToOne(() => UserEntity, user => user.cart, { nullable: false })
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

// -------------------- User --------------------
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
