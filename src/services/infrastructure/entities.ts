import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  BeforeInsert,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
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
