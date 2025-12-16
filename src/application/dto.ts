import { 
  UserDM, 
  CategoryDM, 
  SubcategoryDM, 
  DiscountDM, 
  PurchaseDM, 
  CartDM
} from "../domain/models";

export class UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;

  constructor(id: string, name: string, email: string, role: string, isVerified: boolean) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.isVerified = isVerified;
  }

  static fromDomain(user: UserDM): UserDto {
    return new UserDto(user.id, user.name, user.email, user.role, user.isVerified);
  }
}

export class CategoryDto {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromDomain(category: CategoryDM): CategoryDto {
    return new CategoryDto(category.id, category.name);
  }
}

export class CategoryWithCountDto {
  category: CategoryDto;
  subcategoryCount: number;

  constructor(category: CategoryDto, subcategoryCount: number) {
    this.category = category;
    this.subcategoryCount = subcategoryCount;
  }

  static fromDomain(domain: { category: CategoryDM; subcategoryCount: number }) {
    return new CategoryWithCountDto(CategoryDto.fromDomain(domain.category), domain.subcategoryCount);
  }
}


export class SubcategoryDto {
  id: string;
  name: string;
  categoryId: string;

  constructor(id: string, name: string, categoryId: string) {
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
  }

  static fromDomain(sub: SubcategoryDM): SubcategoryDto {
    return new SubcategoryDto(sub.id, sub.name, sub.categoryId);
  }
}

// с категорией
export class SubcategoryWithCategoryNameDto {
  subcategory: SubcategoryDto;
  categoryName: string;

  constructor(subcategory: SubcategoryDto, categoryName: string) {
    this.subcategory = subcategory;
    this.categoryName = categoryName;
  }

  static fromDomain(domain: { subcategory: SubcategoryDM; categoryName: string }) {
    return new SubcategoryWithCategoryNameDto(
      SubcategoryDto.fromDomain(domain.subcategory),
      domain.categoryName,
    );
  }
}


export class DiscountDto {
  id!: string;
  code!: string;
  type!: 'PERCENT' | 'FIXED';
  value!: number;
  scope!: 'SERVICE' | 'CART' | 'USER';
  serviceId?: string;
  userId?: string;
  validFrom?: Date;
  validUntil?: Date;
  firstPurchaseOnly!: boolean;
  createdAt!: Date;

  static fromDomain(dm: DiscountDM): DiscountDto {
    const dto = new DiscountDto();
    dto.id = dm.id;
    dto.code = dm.code;
    dto.type = dm.type;
    dto.value = dm.value;
    dto.scope = dm.scope;
    dto.serviceId = dm.serviceId;
    dto.userId = dm.userId;
    dto.validFrom = dm.validFrom;
    dto.validUntil = dm.validUntil;
    dto.firstPurchaseOnly = dm.firstPurchaseOnly;
    dto.createdAt = dm.createdAt!;
    return dto;
  }
}


export class PurchaseDto {
  id!: string;
  userId!: string;
  serviceId!: string;
  discountId?: string;
  amount!: number;
  purchasedAt!: Date;

  static fromDomain(dm: PurchaseDM): PurchaseDto {
    const dto = new PurchaseDto();
    dto.id = dm.id;
    dto.userId = dm.userId;
    dto.serviceId = dm.serviceId;
    dto.discountId = dm.discountId;
    dto.amount = dm.amount ?? 0;
    dto.purchasedAt = dm.purchasedAt ?? new Date();
    return dto;
  }
}

export class CartDto { 
  id!: string; 
  userId!: string; 
  serviceId!: string; 

  static fromDomain(dm: CartDM): CartDto { 
    const dto = new CartDto(); 
    dto.id = dm.id; 
    dto.userId = dm.userId; 
    dto.serviceId = dm.serviceId; 
    return dto; 
  } 
}