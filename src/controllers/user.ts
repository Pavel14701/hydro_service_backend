import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmailVerificationService } from '../application/services/email-verification';
import { UsersService } from '../application/services/user';
import { UserDto } from '../application/dto';
import { CreateUserSchema, LoginUserSchema } from './schemas/user';

@Controller('auth')
export class EmailVerificationController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}

  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.emailVerificationService.verifyEmail(token);
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