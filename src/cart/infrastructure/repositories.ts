import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CartEntity } from './entities';
import { PurchaseEntity } from '../../purchases/infrastructure/entities';

@Injectable()
export class CartRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findPaginated(
    page: number,
    limit: number,
    sortBy: keyof CartEntity = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CartEntity[]> {
    const offset = (page - 1) * limit;
    const result = await this.dataSource.query(
      `SELECT * FROM "cart"
       ORDER BY ${String(sortBy)} ${sortOrder}
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return result as CartEntity[];
  }

  async findById(id: string): Promise<CartEntity | null> {
    const result = await this.dataSource.query(
      'SELECT * FROM "cart" WHERE id = $1',
      [id],
    );
    return result.length > 0 ? (result[0] as CartEntity) : null;
  }

  async findByUser(userId: string, page: number, limit: number): Promise<CartEntity[]> {
    const offset = (page - 1) * limit;
    const result = await this.dataSource.query(
      `SELECT * FROM "cart" WHERE "userId" = $1
       ORDER BY "id" ASC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );
    return result as CartEntity[];
  }

  async count(): Promise<number> {
    const result = await this.dataSource.query(
      'SELECT COUNT(*)::int AS total FROM "cart"',
    );
    return result[0].total;
  }

  async countByUser(userId: string): Promise<number> {
    const result = await this.dataSource.query(
      'SELECT COUNT(*)::int AS total FROM "cart" WHERE "userId" = $1',
      [userId],
    );
    return result[0].total;
  }

  async insert(cart: CartEntity): Promise<CartEntity> {
    const result = await this.dataSource.query(
      `INSERT INTO "cart"(id, "userId", "serviceId")
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [cart.id, (cart as any).user.id, (cart as any).service.id],
    );
    // Если уже было в корзине — вернётся пусто; подтянем существующую запись
    if (result.length === 0) {
      const existing = await this.dataSource.query(
        `SELECT * FROM "cart" WHERE "userId" = $1 AND "serviceId" = $2 LIMIT 1`,
        [(cart as any).user.id, (cart as any).service.id],
      );
      return existing[0] as CartEntity;
    }
    return result[0] as CartEntity;
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.query('DELETE FROM "cart" WHERE id = $1', [id]);
  }

  async deleteByUserAndService(userId: string, serviceId: string): Promise<void> {
    await this.dataSource.query(
      'DELETE FROM "cart" WHERE "userId" = $1 AND "serviceId" = $2',
      [userId, serviceId],
    );
  }

    async checkout(userId: string): Promise<PurchaseEntity[]> {
    return await this.dataSource.transaction(async (manager) => {
        // 1. Получаем все услуги из корзины
        const cartItems = await manager.query(
        `SELECT * FROM "cart" WHERE "userId" = $1`,
        [userId],
        );
        if (cartItems.length === 0) {
        return [];
        }
        const purchases: PurchaseEntity[] = [];
        // 2. Переносим каждую услугу в покупки
        for (const item of cartItems) {
        const result = await manager.query(
            `INSERT INTO "purchases"(id, "userId", "serviceId", "purchasedAt")
            VALUES ($1, $2, $3, NOW())
            RETURNING *`,
            [item.id, item.userId, item.serviceId],
        );
        purchases.push(result[0] as PurchaseEntity);
        }
        // 3. Чистим корзину
        await manager.query(
        `DELETE FROM "cart" WHERE "userId" = $1`,
        [userId],
        );

        return purchases;
    });
    }
}
