import { Injectable, Inject } from '@nestjs/common';
import { ISubcategoriesRepository } from '../../application/interfaces';
import { SubcategoryEntity } from '../entities';
import { IDataSource } from '../../application/interfaces';

@Injectable()
export class SubcategoriesRepository implements ISubcategoriesRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async findPaginated(
    page: number,
    limit: number,
    sortBy: keyof SubcategoryEntity = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<SubcategoryEntity[]> {
    const offset = (page - 1) * limit;
    const columnMap: Partial<Record<keyof SubcategoryEntity, string>> = {
      id: 'id',
      name: 'name',
      categoryId: '"categoryId"',
    };
    const safeColumn = columnMap[sortBy] ?? 'name';
    const safeOrder = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    return await this.dataSource.query<SubcategoryEntity>(
      `SELECT * FROM "subcategories"
      ORDER BY ${safeColumn} ${safeOrder}
      LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
  }

  async findAll(): Promise<SubcategoryEntity[]> {
    return await this.dataSource.query<SubcategoryEntity>(
      'SELECT * FROM "subcategories" ORDER BY name ASC',
    );
  }

  async findById(id: string): Promise<SubcategoryEntity | null> {
    const result = await this.dataSource.query<SubcategoryEntity>(
      'SELECT * FROM "subcategories" WHERE id = $1',
      [id],
    );
    return result.length > 0 ? result[0] : null;
  }

  async findByNameAndCategory(name: string, categoryId: string): Promise<SubcategoryEntity | null> {
    const result = await this.dataSource.query<SubcategoryEntity>(
      'SELECT * FROM "subcategories" WHERE LOWER(name) = LOWER($1) AND "categoryId" = $2 LIMIT 1',
      [name, categoryId],
    );
    return result.length > 0 ? result[0] : null;
  }

  async insert(subcategory: SubcategoryEntity): Promise<SubcategoryEntity> {
    const result = await this.dataSource.query<SubcategoryEntity>(
      'INSERT INTO "subcategories"(id, name, "categoryId") VALUES ($1, $2, $3) RETURNING *',
      [subcategory.id, subcategory.name, subcategory.categoryId],
    );
    return result[0];
  }

  async update(subcategory: SubcategoryEntity): Promise<SubcategoryEntity> {
    const result = await this.dataSource.query<SubcategoryEntity>(
      'UPDATE "subcategories" SET name = $2, "categoryId" = $3 WHERE id = $1 RETURNING *',
      [subcategory.id, subcategory.name, subcategory.categoryId],
    );
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.query('DELETE FROM "subcategories" WHERE id = $1', [id]);
  }

  async deleteByCategoryId(categoryId: string): Promise<void> {
    await this.dataSource.query('DELETE FROM "subcategories" WHERE "categoryId" = $1', [categoryId]);
  }

  async count(): Promise<number> {
    const result = await this.dataSource.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM "subcategories"',
    );
    return result[0].total;
  }

  async countByCategoryId(categoryId: string): Promise<number> {
    const result = await this.dataSource.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM "subcategories" WHERE "categoryId" = $1',
      [categoryId],
    );
    return result[0].total;
  }
}