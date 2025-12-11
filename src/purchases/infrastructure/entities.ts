import { Entity, PrimaryColumn, ManyToOne, Column, BeforeInsert } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { ServiceEntity } from '../../services/infrastructure/entities';

@Entity('purchases')
export class PurchaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, user => user.purchases, { nullable: false })
  user!: UserEntity;

  @ManyToOne(() => ServiceEntity, { nullable: false })
  service!: ServiceEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchasedAt!: Date;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }
}
