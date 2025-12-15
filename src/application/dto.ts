import { UserDM, CategoryDM, SubcategoryDM } from "../domain/models";

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
