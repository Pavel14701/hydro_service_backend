import { 
    BeforeInsert, 
    Column,
    Entity, 
    JoinColumn, 
    JoinTable, 
    ManyToMany, 
    ManyToOne, 
    PrimaryColumn 
} from "typeorm";
import { uuidv7 } from "uuidv7";
import { CategoryEntity } from "./category";
import { decimalTransformer } from "./utils"
import { SubcategoryEntity } from "./subcategory";

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

  @ManyToMany(() => SubcategoryEntity, (sub) => sub.services)
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
