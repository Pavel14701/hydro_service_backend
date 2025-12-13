import { Injectable, Inject } from '@nestjs/common';
import { ICategoriesRepository, IServicesRepository, ISubcategoriesRepository } from '../../application/interfaces';
import { CategoryEntity, ServiceEntity, SubcategoryEntity } from '../entities';
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
    return await this.dataSource.query<ServiceEntity>(
          `SELECT * FROM "services"
           ORDER BY ${sortBy} ${sortOrder}
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

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async findPaginated(
    page: number,
    limit: number,
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CategoryEntity[]> {
    const offset = (page - 1) * limit;
    return await this.dataSource.query<CategoryEntity>(
          `SELECT * FROM "categories"
           ORDER BY ${sortBy} ${sortOrder}
           LIMIT $1 OFFSET $2`,
          [limit, offset],
        );
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const result = await this.dataSource.query<CategoryEntity>(
      'SELECT * FROM "categories" WHERE id = $1',
      [id],
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

@Injectable()
export class SubcategoriesRepository implements ISubcategoriesRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async findPaginated(
    page: number,
    limit: number,
    sortBy: string = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<SubcategoryEntity[]> {
    const offset = (page - 1) * limit;
    return await this.dataSource.query<SubcategoryEntity>(
          `SELECT * FROM "subcategories"
           ORDER BY ${sortBy} ${sortOrder}
           LIMIT $1 OFFSET $2`,
          [limit, offset],
        );
  }

  async findById(id: string): Promise<SubcategoryEntity | null> {
    const result = await this.dataSource.query<SubcategoryEntity>(
      'SELECT * FROM "subcategories" WHERE id = $1',
      [id],
    );
    return result.length > 0 ? result[0] : null;
  }

  async insert(subcategory: SubcategoryEntity): Promise<SubcategoryEntity> {
    const result = await this.dataSource.query<SubcategoryEntity>(
      'INSERT INTO "subcategories"(id, name, "categoryId") VALUES ($1, $2, $3) RETURNING *',
      [subcategory.id, subcategory.name, subcategory.category.id],
    );
    return result[0];
  }

  async update(subcategory: SubcategoryEntity): Promise<SubcategoryEntity> {
    const result = await this.dataSource.query<SubcategoryEntity>(
      'UPDATE "subcategories" SET name = $2, "categoryId" = $3 WHERE id = $1 RETURNING *',
      [subcategory.id, subcategory.name, subcategory.category.id],
    );
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.dataSource.query('DELETE FROM "subcategories" WHERE id = $1', [id]);
  }

  async count(): Promise<number> {
    const result = await this.dataSource.query<{ total: number }>(
      'SELECT COUNT(*)::int AS total FROM "subcategories"',
    );
    return result[0].total;
  }
}
