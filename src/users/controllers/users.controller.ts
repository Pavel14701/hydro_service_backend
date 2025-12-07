import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserSchema } from './schemas/create-user.schema';
import { UserDto } from '../application/user.dto';
import { LoginUserSchema } from './schemas/login-user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    const users = await this.usersService.findAll();
    return users.map(UserDto.fromDomain);
  }

  @Post()
  async createUser(@Body() body: CreateUserSchema): Promise<UserDto> {
    const user = await this.usersService.create(body.name, body.email, body.password);
    return UserDto.fromDomain(user);
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
  @Post('login')
  async login(@Body() body: LoginUserSchema): Promise<{ success: boolean }> {
    const { email, password } = body;
    const isValid = await this.usersService.validatePasswordByEmail(email, password);
    return { success: isValid };
  }
}