import { Injectable, NotFoundException } from '@nestjs/common';
import { CartDM, PurchaseDM } from '../../domain/models';
import { Mapper } from '../../domain/mapper';
import { uuidv7 } from 'uuidv7';
import { ICartRepository } from '../interfaces';
import { CartEntity } from '../../infrastructure/entities/cart';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: ICartRepository) {}

  async getCartById(id: string): Promise<CartDM> {
    const entity = await this.cartRepository.findById(id);
    if (!entity) throw new NotFoundException(`Cart item with id ${id} not found`);
    return Mapper.toDomain(entity, CartDM);
  }

  async getCartPaginated(
    page: number,
    limit: number,
    sortBy: keyof CartEntity = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CartDM[]> {
    const entities = await this.cartRepository.findPaginated(page, limit, sortBy, sortOrder);
    return Mapper.toDomainList(entities, CartDM);
  }

  async getCartByUser(userId: string, page: number, limit: number): Promise<CartDM[]> {
    const entities = await this.cartRepository.findByUser(userId, page, limit);
    return Mapper.toDomainList(entities, CartDM);
  }

  async countCart(): Promise<number> {
    return this.cartRepository.count();
  }

  async countCartByUser(userId: string): Promise<number> {
    return this.cartRepository.countByUser(userId);
  }

  async addToCart(data: { userId: string; serviceId: string }): Promise<CartDM> {
    const entity = new CartEntity();
    entity.id = uuidv7();
    entity.userId = data.userId;
    entity.serviceId = data.serviceId;

    const inserted = await this.cartRepository.insert(entity);
    return Mapper.toDomain(inserted, CartDM);
  }

  async removeFromCart(id: string): Promise<void> {
    const existing = await this.cartRepository.findById(id);
    if (!existing) throw new NotFoundException(`Cart item with id ${id} not found`);
    await this.cartRepository.delete(id);
  }

  async removeByUserAndService(userId: string, serviceId: string): Promise<void> {
    await this.cartRepository.deleteByUserAndService(userId, serviceId);
  }

  async checkout(userId: string): Promise<PurchaseDM[]> {
    const purchases = await this.cartRepository.checkout(userId);
    return Mapper.toDomainList(purchases, PurchaseDM);
  }
}
