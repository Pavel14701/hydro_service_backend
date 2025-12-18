import { Injectable, Inject } from '@nestjs/common';
import { ICategoriesRepository } from '../../application/interfaces';
import { CategoryEntity } from '../entities/category';
import { IDataSource } from '../../application/interfaces';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async findPaginated(
    page: number,
    limit: number,
    sortBy: keyof CategoryEntity = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CategoryEntity[]> {
    const offset = (page - 1) * limit;
    const safeColumn = ['id', 'name'].includes(sortBy) ? sortBy : 'name';
    const safeOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    return await this.dataSource.query<CategoryEntity>(
      `SELECT * FROM "categories"
       ORDER BY ${safeColumn} ${safeOrder}
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.dataSource.query<CategoryEntity>(
      'SELECT * FROM "categories" ORDER BY name ASC',
    );
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const result = await this.dataSource.query<CategoryEntity>(
      'SELECT * FROM "categories" WHERE id = $1',
      [id],
    );
    return result.length > 0 ? result[0] : null;
  }

  async findByIds(ids: string[]): Promise<CategoryEntity[]> {
    return await this.dataSource.query<CategoryEntity>(
      'SELECT * FROM "categories" WHERE id = ANY($1)',
      [ids],
    );
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    const result = await this.dataSource.query<CategoryEntity>(
      'SELECT * FROM "categories" WHERE LOWER(name) = LOWER($1) LIMIT 1',
      [name],
    );
    return result.length > 0 ? result[0] : null;
  }

  async insert(category: CategoryEntity): Promise<CategoryEntity> {
    const result = await this.dataSource.query<CategoryEntity>(
      'INSERT INTO "categories"(id, name) VALUES ($1, $2) RETURNING *',
      [category.id, category.name],
    );
    return result[0];
  }

  async update(category: CategoryEntity): Promise<CategoryEntity> {
    const result = await this.dataSource.query<CategoryEntity>(
      'UPDATE "categories" SET name = $2 WHERE id = $1 RETURNING *',
      [category.id, category.name],
    );
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.query('DELETE FROM "categories" WHERE id = $1', [id]);
  }

  async count(): Promise<number> {
    const result = await this.dataSource.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM "categories"',
    );
    return result[0].total;
  }
}
