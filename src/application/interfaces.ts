import { CartEntity } from "../infrastructure/entities/cart";
import { CategoryEntity } from "../infrastructure/entities/category";
import { DiscountEntity } from "../infrastructure/entities/discount";
import { PurchaseEntity } from "../infrastructure/entities/purchase";
import { ServiceEntity } from "../infrastructure/entities/service";
import { SubcategoryEntity } from "../infrastructure/entities/subcategory";
import { UserEntity } from "../infrastructure/entities/user";

export interface IEmailVerificationRepository {
  saveToken(token: string, userId: string): Promise<void>;
  findToken(token: string): Promise<any>;
  markTokenUsed(id: string): Promise<void>;
  verifyUser(userId: string): Promise<void>;
}

export interface IMailService {
  sendMail(to: string, subject: string, html: string): Promise<void>;
}

export interface IPasswordAdapter {
  hash(plain: string): Promise<string>;
  verify(hash: string, plain: string): Promise<boolean>;
}

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
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<SubcategoryEntity[]>;
  findAll(): Promise<SubcategoryEntity[]>;
  findById(id: string): Promise<SubcategoryEntity | null>;
  findByNameAndCategory(name: string, categoryId: string): Promise<SubcategoryEntity | null>;
  insert(subcategory: SubcategoryEntity): Promise<SubcategoryEntity>;
  update(subcategory: SubcategoryEntity): Promise<SubcategoryEntity>;
  delete(id: string): Promise<void>;
  deleteByCategoryId(categoryId: string): Promise<void>;
  count(): Promise<number>;
  countByCategoryId(categoryId: string): Promise<number>;
}


export interface ICategoriesRepository {
  findPaginated(
    page: number,
    limit: number,
    sortBy?: keyof CategoryEntity,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<CategoryEntity[]>;
  findAll(): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity | null>;
  findByIds(ids: string[]): Promise<CategoryEntity[]>;
  findByName(name: string): Promise<CategoryEntity | null>;
  insert(category: CategoryEntity): Promise<CategoryEntity>;
  update(category: CategoryEntity): Promise<CategoryEntity>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}


export interface IUsersRepository {
  findAll(): Promise<UserEntity[]>;
  insert(id: string, name: string, email: string, hashedPassword: string): Promise<UserEntity>;
  findPasswordByEmail(email: string): Promise<string | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
}


export interface IDataSource {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  transaction<T>(cb: (manager: { query: (sql: string, params?: any[]) => Promise<any[]> }) => Promise<T>): Promise<T>;
  lockRow(table: string, id: string | number, mode?: 'FOR UPDATE' | 'FOR SHARE'): Promise<void>;
  acquireAdvisoryLock(key: number): Promise<void>;
  releaseAdvisoryLock(key: number): Promise<void>;
}

export interface IDiscountRepository {
  findById(id: string): Promise<DiscountEntity | null>;
  findByCode(code: string): Promise<DiscountEntity | null>;
  findAll(page: number, limit: number): Promise<DiscountEntity[]>;
  insert(discount: DiscountEntity): Promise<DiscountEntity>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}


export interface IPurchaseRepository{
  findPaginated(
      page: number,
      limit: number,
      sortBy: keyof PurchaseEntity,
      sortOrder: 'ASC' | 'DESC',
  ): Promise<PurchaseEntity[]>; 
  findById(id: string): Promise<PurchaseEntity | null>;
  findByUser(userId: string, page: number, limit: number): Promise<PurchaseEntity[]>;
  count(): Promise<number>;
  countByUser(userId: string): Promise<number>;
  insert(purchase: PurchaseEntity): Promise<PurchaseEntity>;
}


export interface ICartRepository{
  findPaginated(
      page: number,
      limit: number,
      sortBy: keyof CartEntity,
      sortOrder: 'ASC' | 'DESC',
    ): Promise<CartEntity[]>;
  findById(id: string): Promise<CartEntity | null>;
  findByUser(userId: string, page: number, limit: number): Promise<CartEntity[]>;
  count(): Promise<number>;
  countByUser(userId: string): Promise<number>;
  insert(cart: CartEntity): Promise<CartEntity>;
  delete(id: string): Promise<void>;
  deleteByUserAndService(userId: string, serviceId: string): Promise<void>;
  checkout(userId: string): Promise<PurchaseEntity[]>;
}