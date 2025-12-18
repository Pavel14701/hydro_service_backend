import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { uuidv7 } from "uuidv7";
import { SubcategoryEntity } from "./subcategory";
import { ServiceEntity } from "./service";

// -------------------- Category --------------------
@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @OneToMany(() => SubcategoryEntity, (sub) => sub.category)
  subcategories!: SubcategoryEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.category)
  services!: ServiceEntity[];

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}
