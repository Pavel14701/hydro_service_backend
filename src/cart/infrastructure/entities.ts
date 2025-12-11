import { Entity, PrimaryColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { ServiceEntity } from '../../services/infrastructure/entities';

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
