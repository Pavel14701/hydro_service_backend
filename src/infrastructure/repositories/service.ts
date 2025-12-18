import { Injectable, Inject } from '@nestjs/common';
import { IServicesRepository } from '../../application/interfaces';
import { ServiceEntity } from '../entities/service';
import { IDataSource } from '../../application/interfaces';

@Injectable()
export class ServicesRepository implements IServicesRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async findPaginated(
    page: number,
    limit: number,
    sortBy: string = 'title',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<ServiceEntity[]> {
    const offset = (page - 1) * limit;
    const allowedColumns = ['id', 'title', 'price'];
    const allowedOrders = ['ASC', 'DESC'];
    const safeColumn = allowedColumns.includes(sortBy) ? sortBy : 'title';
    const safeOrder = allowedOrders.includes(sortOrder) ? sortOrder : 'ASC';
    return await this.dataSource.query<ServiceEntity>(
          `SELECT s.*, c.name as "categoryName"
          FROM "services" s
          JOIN "categories" c ON s."categoryId" = c.id
          ORDER BY s.${safeColumn} ${safeOrder}
          LIMIT $1 OFFSET $2`,
          [limit, offset],
        );
  }


  async findById(id: string): Promise<ServiceEntity | null> {
    const result = await this.dataSource.query<ServiceEntity>(
      'SELECT * FROM "services" WHERE id = $1',
      [id],
    );
    return result.length > 0 ? result[0] : null;
  }

  async insert(service: ServiceEntity): Promise<ServiceEntity> {
    const result = await this.dataSource.query<ServiceEntity>(
      `INSERT INTO "services"(id, title, description, price, "mediaLinks", "categoryId")
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        service.id,
        service.title,
        service.description,
        service.price,
        service.mediaLinks,
        service.category.id,
      ],
    );
    return result[0];
  }

  async update(service: ServiceEntity): Promise<ServiceEntity> {
    const result = await this.dataSource.query<ServiceEntity>(
      `UPDATE "services"
       SET title = $2, description = $3, price = $4, "mediaLinks" = $5, "categoryId" = $6
       WHERE id = $1
       RETURNING *`,
      [
        service.id,
        service.title,
        service.description,
        service.price,
        service.mediaLinks,
        service.category.id,
      ],
    );
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.query('DELETE FROM "services" WHERE id = $1', [id]);
  }

  async count(): Promise<number> {
    const result = await this.dataSource.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM "services"',
    );
    return result[0].total;
  }
}