import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body.name, body.email);
  }
}
