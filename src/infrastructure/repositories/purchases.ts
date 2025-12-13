import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PurchaseEntity } from '../entities';
import { IDataSource } from '../../application/interfaces';

@Injectable()
export class PurchaseRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async findPaginated(
    page: number,
    limit: number,
    sortBy: keyof PurchaseEntity = 'purchasedAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<PurchaseEntity[]> {
    const offset = (page - 1) * limit;
    return await this.dataSource.query<PurchaseEntity>(
          `SELECT * FROM "purchases"
           ORDER BY ${String(sortBy)} ${sortOrder}
           LIMIT $1 OFFSET $2`,
          [limit, offset],
        );
  }

  async findById(id: string): Promise<PurchaseEntity | null> {
    const result = await this.dataSource.query<PurchaseEntity>(
      'SELECT * FROM "purchases" WHERE id = $1',
      [id],
    );
    return result.length > 0 ? result[0] : null;
  }

  async findByUser(userId: string, page: number, limit: number): Promise<PurchaseEntity[]> {
    const offset = (page - 1) * limit;
    return await this.dataSource.query<PurchaseEntity>(
          `SELECT * FROM "purchases" WHERE "userId" = $1
           ORDER BY "purchasedAt" DESC, "id" DESC
           LIMIT $2 OFFSET $3`,
          [userId, limit, offset],
        );
  }

  async count(): Promise<number> {
    const result = await this.dataSource.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM "purchases"',
    );
    return result[0].total;
  }

  async countByUser(userId: string): Promise<number> {
    const result = await this.dataSource.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM "purchases" WHERE "userId" = $1',
      [userId],
    );
    return result[0].total;
  }

  async insert(purchase: PurchaseEntity): Promise<PurchaseEntity> {
    const result = await this.dataSource.query<PurchaseEntity>(
      `INSERT INTO "purchases"(id, "userId", "serviceId", "purchasedAt")
       VALUES ($1, $2, $3, COALESCE($4, NOW()))
       RETURNING *`,
      [purchase.id, (purchase as any).user.id, (purchase as any).service.id, purchase.purchasedAt],
    );
    return result[0];
  }

  // История покупок не должна меняться. Если потребуется метаданные — создаём отдельное поле.
  async update(): Promise<never> {
    throw new BadRequestException('Purchase history is immutable and cannot be updated');
  }

  async delete(): Promise<never> {
    throw new BadRequestException('Purchase history cannot be deleted');
  }
}
