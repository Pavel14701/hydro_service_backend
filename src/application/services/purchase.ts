import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseDM } from '../../domain/models';
import { Mapper } from '../../domain/mapper';
import { PurchaseEntity } from '../../infrastructure/entities';
import { uuidv7 } from 'uuidv7';
import { IPurchaseRepository } from '../interfaces';

@Injectable()
export class PurchaseService {
  constructor(private readonly purchaseRepository: IPurchaseRepository) {}

  async getPurchaseById(id: string): Promise<PurchaseDM> {
    const entity = await this.purchaseRepository.findById(id);
    if (!entity) throw new NotFoundException(`Purchase with id ${id} not found`);
    return Mapper.toDomain(entity, PurchaseDM);
  }

  async getPurchasesPaginated(
    page: number,
    limit: number,
    sortBy: keyof PurchaseEntity = 'purchasedAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<PurchaseDM[]> {
    const entities = await this.purchaseRepository.findPaginated(page, limit, sortBy, sortOrder);
    return Mapper.toDomainList(entities, PurchaseDM);
  }

  async getPurchasesByUser(userId: string, page: number, limit: number): Promise<PurchaseDM[]> {
    const entities = await this.purchaseRepository.findByUser(userId, page, limit);
    return Mapper.toDomainList(entities, PurchaseDM);
  }

  async countPurchases(): Promise<number> {
    return this.purchaseRepository.count();
  }

  async countPurchasesByUser(userId: string): Promise<number> {
    return this.purchaseRepository.countByUser(userId);
  }

  async createPurchase(data: {
    userId: string;
    serviceId: string;
    discountId?: string;
    amount?: number;
    purchasedAt?: Date;
  }): Promise<PurchaseDM> {
    const entity = new PurchaseEntity();
    entity.id = uuidv7();
    entity.userId = data.userId;
    entity.serviceId = data.serviceId;
    entity.discountId = data.discountId;

    entity.amount = data.amount ?? 0;
    entity.purchasedAt = data.purchasedAt ?? new Date();

    const inserted = await this.purchaseRepository.insert(entity);
    return Mapper.toDomain(inserted, PurchaseDM);
  }
}
