// src/users/controllers/schemas/login-user.schema.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserSchema {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
