import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ICategoriesRepository, ISubcategoriesRepository } from '../interfaces';
import { CategoryDM } from '../../domain/models';
import { Mapper } from '../../domain/mapper';
import { CategoryEntity } from '../../infrastructure/entities/category';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: ICategoriesRepository,
    private readonly subcategoriesRepository: ISubcategoriesRepository,
  ) {}

  // Пагинация + сортировка
  async getCategories(
    page: number,
    limit: number,
    sortBy: keyof CategoryEntity = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CategoryDM[]> {
    const entities = await this.categoriesRepository.findPaginated(page, limit, sortBy, sortOrder);
    return Mapper.toDomainList(entities, CategoryDM);
  }

  // Получение категории по id
  async getCategoryById(id: string): Promise<CategoryDM> {
    const entity = await this.categoriesRepository.findById(id);
    if (!entity) throw new NotFoundException(`Category with id ${id} not found`);
    return Mapper.toDomain(entity, CategoryDM);
  }

  // Создание категории
  async createCategory(name: string): Promise<CategoryDM> {
    const existing = await this.findByName(name);
    if (existing) throw new BadRequestException(`Category "${name}" already exists`);

    const entity = new CategoryEntity();
    entity.name = name;
    const inserted = await this.categoriesRepository.insert(entity);
    return Mapper.toDomain(inserted, CategoryDM);
  }

  // Обновление категории
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

  // Удаление категории с каскадным удалением подкатегорий
  async deleteCategory(id: string): Promise<void> {
    const entity = await this.categoriesRepository.findById(id);
    if (!entity) throw new NotFoundException(`Category with id ${id} not found`);

    await this.subcategoriesRepository.deleteByCategoryId(entity.id);
    await this.categoriesRepository.delete(entity.id);
  }

  // Подсчёт категорий
  async countCategories(): Promise<number> {
    return this.categoriesRepository.count();
  }

  // Поиск по имени
  async findByName(name: string): Promise<CategoryDM | null> {
    const entity = await this.categoriesRepository.findByName(name);
    return entity ? Mapper.toDomain(entity, CategoryDM) : null;
  }

  // Категории с количеством подкатегорий
  async getCategoriesWithSubcategoryCount(): Promise<{ category: CategoryDM; subcategoryCount: number }[]> {
    const entities = await this.categoriesRepository.findAll();
    const result: { category: CategoryDM; subcategoryCount: number }[] = [];

    for (const e of entities) {
      const count = await this.subcategoriesRepository.countByCategoryId(e.id);
      result.push({ category: Mapper.toDomain(e, CategoryDM), subcategoryCount: count });
    }

    return result;
  }

  // Категории без подкатегорий
  async getEmptyCategories(): Promise<CategoryDM[]> {
    const entities = await this.categoriesRepository.findAll();
    const result: CategoryDM[] = [];

    for (const e of entities) {
      const count = await this.subcategoriesRepository.countByCategoryId(e.id);
      if (count === 0) {
        result.push(Mapper.toDomain(e, CategoryDM));
      }
    }

    return result;
  }
}
