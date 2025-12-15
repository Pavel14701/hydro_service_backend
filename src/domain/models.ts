export class UserDM {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: string = 'user',
    public readonly isVerified: boolean = false,
    public readonly password?: string,
  ) {}
}

export class CategoryDM {
  id!: string;
  name!: string;
}

export class SubcategoryDM {
  id!: string;
  name!: string;
  categoryId!: string;
}
