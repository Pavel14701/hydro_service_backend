import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ISubcategoriesRepository, ICategoriesRepository } from '../interfaces';
import { SubcategoryDM } from '../../domain/models';
import { Mapper } from '../../domain/mapper';
import { SubcategoryEntity } from '../../infrastructure/entities/subcategory';

@Injectable()
export class SubcategoriesService {
  constructor(
    private readonly subcategoriesRepository: ISubcategoriesRepository,
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  async getSubcategories(
    page: number,
    limit: number,
    sortBy: keyof SubcategoryEntity = 'name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<SubcategoryDM[]> {
    const entities = await this.subcategoriesRepository.findPaginated(page, limit, sortBy, sortOrder);
    return Mapper.toDomainList(entities, SubcategoryDM);
  }

  async getSubcategoryById(id: string): Promise<SubcategoryDM> {
    const entity = await this.subcategoriesRepository.findById(id);
    if (!entity) throw new NotFoundException(`Subcategory with id ${id} not found`);
    return Mapper.toDomain(entity, SubcategoryDM);
  }

  async createSubcategory(name: string, categoryId: string): Promise<SubcategoryDM> {
    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) throw new BadRequestException(`Category with id ${categoryId} does not exist`);

    const existing = await this.subcategoriesRepository.findByNameAndCategory(name, categoryId);
    if (existing) throw new BadRequestException(`Subcategory "${name}" already exists in this category`);

    const entity = new SubcategoryEntity();
    entity.name = name;
    entity.categoryId = categoryId;
    const inserted = await this.subcategoriesRepository.insert(entity);
    return Mapper.toDomain(inserted, SubcategoryDM);
  }

  async updateSubcategory(id: string, name: string, categoryId: string): Promise<SubcategoryDM> {
    const entity = await this.subcategoriesRepository.findById(id);
    if (!entity) throw new NotFoundException(`Subcategory with id ${id} not found`);

    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) throw new BadRequestException(`Category with id ${categoryId} does not exist`);

    const duplicate = await this.subcategoriesRepository.findByNameAndCategory(name, categoryId);
    if (duplicate && duplicate.id !== id) {
      throw new BadRequestException(`Subcategory "${name}" already exists in this category`);
    }

    entity.name = name;
    entity.categoryId = categoryId;
    const updated = await this.subcategoriesRepository.update(entity);
    return Mapper.toDomain(updated, SubcategoryDM);
  }

  async deleteSubcategory(id: string): Promise<void> {
    const entity = await this.subcategoriesRepository.findById(id);
    if (!entity) throw new NotFoundException(`Subcategory with id ${id} not found`);
    await this.subcategoriesRepository.delete(entity.id);
  }

  async countSubcategories(): Promise<number> {
    return this.subcategoriesRepository.count();
  }

  async getSubcategoriesWithCategoryName(): Promise<{ subcategory: SubcategoryDM; categoryName: string }[]> {
    const entities = await this.subcategoriesRepository.findAll();
    if (!entities.length) return [];

    const categoryIds = Array.from(new Set(entities.map(e => e.categoryId)));
    const categories = await this.categoriesRepository.findByIds(categoryIds);

    const categoriesById = new Map<string, string>();
    for (const category of categories) {
      categoriesById.set(category.id, category.name);
    }

    return entities.map(e => ({
      subcategory: Mapper.toDomain(e, SubcategoryDM),
      categoryName: categoriesById.get(e.categoryId) ?? 'Unknown',
    }));
  }
}
