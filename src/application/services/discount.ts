import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IDiscountRepository } from '../interfaces';
import { DiscountEntity } from '../../infrastructure/entities';
import { DiscountDM } from '../../domain/models';
import { Mapper } from '../../domain/mapper';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class DiscountService {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async getDiscountById(id: string): Promise<DiscountDM> {
    const entity = await this.discountRepository.findById(id);
    if (!entity) throw new NotFoundException(`Discount with id ${id} not found`);
    return Mapper.toDomain(entity, DiscountDM);
  }

  async getDiscountByCode(code: string): Promise<DiscountDM> {
    const entity = await this.discountRepository.findByCode(code);
    if (!entity) throw new NotFoundException(`Discount with code "${code}" not found`);
    return Mapper.toDomain(entity, DiscountDM);
  }

  async getAllDiscounts(page: number, limit: number): Promise<DiscountDM[]> {
    const entities = await this.discountRepository.findAll(page, limit);
    return Mapper.toDomainList(entities, DiscountDM);
  }

  // Общая фабрика
  private async createBaseDiscount(data: {
    code: string;
    type: 'PERCENT' | 'FIXED';
    value: number;
    scope: 'SERVICE' | 'CART' | 'USER';
    serviceId?: string;
    userId?: string;
    validFrom?: Date;
    validUntil?: Date;
    firstPurchaseOnly?: boolean;
  }): Promise<DiscountDM> {
    const existing = await this.discountRepository.findByCode(data.code);
    if (existing) throw new BadRequestException(`Discount code "${data.code}" already exists`);

    const entity = new DiscountEntity();
    entity.id = uuidv7();
    entity.code = data.code;
    entity.type = data.type;
    entity.value = data.value;
    entity.scope = data.scope;
    entity.serviceId = data.serviceId;
    entity.userId = data.userId;
    entity.validFrom = data.validFrom;
    entity.validUntil = data.validUntil;
    entity.firstPurchaseOnly = data.firstPurchaseOnly ?? false;

    const inserted = await this.discountRepository.insert(entity);
    return Mapper.toDomain(inserted, DiscountDM);
  }

  // Скидка на сервис
  async createServiceDiscount(code: string, percent: number, serviceId: string): Promise<DiscountDM> {
    return this.createBaseDiscount({
      code,
      type: 'PERCENT',
      value: percent,
      scope: 'SERVICE',
      serviceId,
    });
  }

  // Скидка на корзину
  async createCartDiscount(code: string, fixedValue: number): Promise<DiscountDM> {
    return this.createBaseDiscount({
      code,
      type: 'FIXED',
      value: fixedValue,
      scope: 'CART',
    });
  }

  // Скидка для конкретного пользователя
  async createUserDiscount(code: string, percent: number, userId: string): Promise<DiscountDM> {
    return this.createBaseDiscount({
      code,
      type: 'PERCENT',
      value: percent,
      scope: 'USER',
      userId,
    });
  }

  // Скидка только для первой покупки
  async createFirstPurchaseDiscount(code: string, percent: number): Promise<DiscountDM> {
    return this.createBaseDiscount({
      code,
      type: 'PERCENT',
      value: percent,
      scope: 'USER',
      firstPurchaseOnly: true,
    });
  }

  // Временная скидка
  async createTimedDiscount(
    code: string,
    percent: number,
    validFrom: Date,
    validUntil: Date,
  ): Promise<DiscountDM> {
    return this.createBaseDiscount({
      code,
      type: 'PERCENT',
      value: percent,
      scope: 'CART',
      validFrom,
      validUntil,
    });
  }

  async deleteDiscount(id: string): Promise<void> {
    const existing = await this.discountRepository.findById(id);
    if (!existing) throw new NotFoundException(`Discount with id ${id} not found`);
    await this.discountRepository.delete(id);
  }

  async countDiscounts(): Promise<number> {
    return await this.discountRepository.count();
  }
}
