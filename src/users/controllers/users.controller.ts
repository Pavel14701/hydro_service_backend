import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserSchema } from './schemas/create-user.schema';
import { UserDto } from '../application/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    const users = await this.usersService.findAll();
    return users.map(UserDto.fromDomain); // ✅ преобразуем в DTO
  }

  @Post()
  async createUser(@Body() body: CreateUserSchema): Promise<UserDto> {
    const user = await this.usersService.create(body.name, body.email, body.password);
    return UserDto.fromDomain(user); // ✅ возвращаем DTO
  }
}
