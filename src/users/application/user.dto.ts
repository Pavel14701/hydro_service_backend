import { User } from "../domain/user";

// src/users/application/user.dto.ts
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

  // удобный статический метод для маппинга
  static fromDomain(user: User): UserDto {
    return new UserDto(user.id, user.name, user.email, user.role, user.isVerified);
  }
}
