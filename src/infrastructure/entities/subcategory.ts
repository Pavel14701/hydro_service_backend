import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { CategoryEntity } from './category';
import { ServiceEntity } from './service';


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

  @ManyToMany(() => ServiceEntity, (service) => service.subcategories)
  services!: ServiceEntity[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}