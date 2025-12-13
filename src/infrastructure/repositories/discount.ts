import { Injectable, Inject } from '@nestjs/common';
import { DiscountEntity } from '../entities';
import { IDataSource } from '../../application/interfaces';

@Injectable()
export class DiscountRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async findById(id: string): Promise<DiscountEntity | null> {
    const result = await this.dataSource.query<DiscountEntity>(
      'SELECT * FROM "discounts" WHERE id = $1',
      [id],
    );
    return result.length > 0 ? result[0] : null;
  }

  async findByCode(code: string): Promise<DiscountEntity | null> {
    const result = await this.dataSource.query<DiscountEntity>(
      'SELECT * FROM "discounts" WHERE code = $1',
      [code],
    );
    return result.length > 0 ? result[0] : null;
  }

  async findAll(page: number, limit: number): Promise<DiscountEntity[]> {
    const offset = (page - 1) * limit;
    return await this.dataSource.query<DiscountEntity>(
      `SELECT * FROM "discounts"
       ORDER BY "createdAt" DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
  }

  async insert(discount: DiscountEntity): Promise<DiscountEntity> {
    const result = await this.dataSource.query<DiscountEntity>(
      `INSERT INTO "discounts"(
        id, code, type, value, scope, 
        "serviceId", "userId", "validFrom", "validUntil", "firstPurchaseOnly", "createdAt"
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,COALESCE($11,NOW()))
      RETURNING *`,
      [
        discount.id,
        discount.code,
        discount.type,
        discount.value,
        discount.scope,
        (discount as any).service?.id ?? null,
        (discount as any).user?.id ?? null,
        discount.validFrom ?? null,
        discount.validUntil ?? null,
        discount.firstPurchaseOnly,
        discount.createdAt,
      ],
    );
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.query('DELETE FROM "discounts" WHERE id = $1', [id]);
  }

  async count(): Promise<number> {
    const result = await this.dataSource.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM "discounts"',
    );
    return result[0].total;
  }
}
