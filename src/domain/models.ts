import { 
  CartEntity, 
  CategoryEntity, 
  DiscountEntity, 
  PurchaseEntity, 
  ServiceEntity, 
  SubcategoryEntity, 
  UserEntity 
} from "../infrastructure/entities";

export class UserDM {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: string = 'user',
    public readonly isVerified: boolean = false,
    public readonly password?: string,
  ) {}

  static fromEntity(entity: UserEntity): UserDM {
    return new UserDM(
      entity.id,
      entity.name,
      entity.email,
      entity.role,
      entity.isVerified,
      entity.password,
    );
  }
}

export class CategoryDM {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  static fromEntity(entity: CategoryEntity): CategoryDM {
    return new CategoryDM(entity.id, entity.name);
  }
}


export class SubcategoryDM {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly categoryId: string,
  ) {}

  static fromEntity(entity: SubcategoryEntity): SubcategoryDM {
    return new SubcategoryDM(entity.id, entity.name, entity.categoryId);
  }
}



export class ServiceDM {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly price?: number | null,
    public readonly mediaLinks?: string[],
    public readonly categoryId?: string,
  ) {}

  static fromEntity(entity: ServiceEntity): ServiceDM {
    return new ServiceDM(
      entity.id,
      entity.title,
      entity.description,
      entity.price,
      entity.mediaLinks,
      entity.categoryId,
    );
  }
}


export class PurchaseDM {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly serviceId: string,
    public readonly discountId?: string,
    public readonly amount?: number,
    public readonly purchasedAt?: Date,
  ) {}

  static fromEntity(entity: PurchaseEntity): PurchaseDM {
    return new PurchaseDM(
      entity.id,
      entity.userId,
      entity.serviceId,
      entity.discountId,
      entity.amount,
      entity.purchasedAt,
    );
  }
}


export class CartDM {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly serviceId: string,
  ) {}

  static fromEntity(entity: CartEntity): CartDM {
    return new CartDM(entity.id, entity.userId, entity.serviceId);
  }
}


export class DiscountDM {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly type: 'PERCENT' | 'FIXED',
    public readonly value: number,
    public readonly scope: 'SERVICE' | 'CART' | 'USER',
    public readonly serviceId?: string,
    public readonly userId?: string,
    public readonly validFrom?: Date,
    public readonly validUntil?: Date,
    public readonly firstPurchaseOnly: boolean = false,
    public readonly createdAt?: Date,
  ) {}

  static fromEntity(entity: DiscountEntity): DiscountDM {
    return new DiscountDM(
      entity.id,
      entity.code,
      entity.type,
      entity.value,
      entity.scope,
      entity.serviceId,
      entity.userId,
      entity.validFrom,
      entity.validUntil,
      entity.firstPurchaseOnly,
      entity.createdAt,
    );
  }
}

