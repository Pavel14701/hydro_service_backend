import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from '../../infrastructure/entities';
import { ICategoriesRepository, ISubcategoriesRepository } from '../../application/interfaces';
import { CategoryDM } from '../../domain/models';
import { Mapper } from '../../domain/mapper';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: ICategoriesRepository,
    private readonly subcategoriesRepository: ISubcategoriesRepository,
  ) {}

  async getCategories(
    page: number,
    limit: number,
    sortBy: keyof CategoryEntity = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CategoryDM[]> {
    const entities = await this.categoriesRepository.findPaginated(page, limit, sortBy, sortOrder);
    return Mapper.toDomainList(entities, CategoryDM);
  }

  async getCategoryById(id: string): Promise<CategoryDM> {
    const entity = await this.categoriesRepository.findById(id);
    if (!entity) throw new NotFoundException(`Category with id ${id} not found`);
    return Mapper.toDomain(entity, CategoryDM);
  }

  async createCategory(name: string): Promise<CategoryDM> {
    const existing = await this.findByName(name);
    if (existing) throw new BadRequestException(`Category "${name}" already exists`);

    const entity = new CategoryEntity();
    entity.name = name;
    const inserted = await this.categoriesRepository.insert(entity);
    return Mapper.toDomain(inserted, CategoryDM);
  }

  async updateCategory(id: string, name: string): Promise<CategoryDM> {
    const entity = await this.categoriesRepository.findById(id);
    if (!entity) throw new NotFoundException(`Category with id ${id} not found`);

    const duplicate = await this.findByName(name);
    if (duplicate && duplicate.id !== id) {
      throw new BadRequestException(`Category "${name}" already exists`);
    }

    entity.name = name;
    const updated = await this.categoriesRepository.update(entity);
    return Mapper.toDomain(updated, CategoryDM);
  }

  async deleteCategory(id: string): Promise<void> {
    const entity = await this.categoriesRepository.findById(id);
    if (!entity) throw new NotFoundException(`Category with id ${id} not found`);

    const subs = await this.subcategoriesRepository.findPaginated(1, 100, 'name', 'ASC');
    const relatedSubs = subs.filter(s => s.categoryId === entity.id);
    for (const sub of relatedSubs) {
      await this.subcategoriesRepository.delete(sub.id);
    }

    await this.categoriesRepository.delete(entity.id);
  }

  async countCategories(): Promise<number> {
    return this.categoriesRepository.count();
  }

  async findByName(name: string): Promise<CategoryDM | null> {
    const entities = await this.categoriesRepository.findPaginated(1, 100, 'name', 'ASC');
    const found = entities.find(c => c.name.toLowerCase() === name.toLowerCase());
    return found ? Mapper.toDomain(found, CategoryDM) : null;
  }

  async getCategoriesWithSubcategoryCount(): Promise<{ category: CategoryDM; subcategoryCount: number }[]> {
    const entities = await this.categoriesRepository.findPaginated(1, 100, 'name', 'ASC');
    const result: { category: CategoryDM; subcategoryCount: number }[] = [];

    for (const e of entities) {
      const subs = await this.subcategoriesRepository.findPaginated(1, 100, 'name', 'ASC');
      const count = subs.filter(s => s.categoryId === e.id).length;
      result.push({ category: Mapper.toDomain(e, CategoryDM), subcategoryCount: count });
    }

    return result;
  }

  async getEmptyCategories(): Promise<CategoryDM[]> {
    const entities = await this.categoriesRepository.findPaginated(1, 100, 'name', 'ASC');
    const result: CategoryDM[] = [];

    for (const e of entities) {
      const subs = await this.subcategoriesRepository.findPaginated(1, 100, 'name', 'ASC');
      if (subs.filter(s => s.categoryId === e.id).length === 0) {
        result.push(Mapper.toDomain(e, CategoryDM));
      }
    }

    return result;
  }
}
