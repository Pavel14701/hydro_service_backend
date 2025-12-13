import { 
  ServiceEntity,
  SubcategoryEntity,
  CategoryEntity,
  UserEntity
} from '../infrastructure/entities';

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

export interface IUsersRepository {
  findAll(): Promise<UserEntity[]>;
  insert(id: string, name: string, email: string, hashedPassword: string): Promise<UserEntity>;
  findPasswordByEmail(email: string): Promise<string | null>;
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
