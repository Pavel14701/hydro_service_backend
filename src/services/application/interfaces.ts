import { 
  ServiceEntity,
  SubcategoryEntity,
  CategoryEntity
} from '../infrastructure/entities';

export interface IServicesRepository {
  findPaginated(
    page: number,
    limit: number,
    sortBy?: keyof ServiceEntity,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<ServiceEntity[]>;
  findById(id: string): Promise<ServiceEntity | null>;
  insert(service: ServiceEntity): Promise<ServiceEntity>;
  update(service: ServiceEntity): Promise<ServiceEntity>;
  delete(id: string): Promise<void>;
  count(): Promise<number>; 
}

export interface ISubcategoriesRepository {
  findPaginated(
    page: number,
    limit: number,
    sortBy?: keyof SubcategoryEntity,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<SubcategoryEntity[]>;
  findById(id: string): Promise<SubcategoryEntity | null>;
  insert(subcategory: SubcategoryEntity): Promise<SubcategoryEntity>;
  update(subcategory: SubcategoryEntity): Promise<SubcategoryEntity>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

export interface ICategoriesRepository {
  findPaginated(
    page: number,
    limit: number,
    sortBy?: keyof CategoryEntity,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity | null>;
  insert(category: CategoryEntity): Promise<CategoryEntity>;
  update(category: CategoryEntity): Promise<CategoryEntity>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}
