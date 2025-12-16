import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EmailVerificationService } from '../application/services/email-verification';
import { UsersService } from '../application/services/user';
import { UserDto } from '../application/dto';
import { CreateUserSchema, LoginUserSchema } from './schemas/user';
import { Request } from 'express';
import { AuthGuard } from '../infrastructure/adapters/guard';

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
  async login(
    @Body() body: LoginUserSchema,
    @Req() req: Request,
  ) {
    const user = await this.usersService.login(body.email, body.password);
    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    return { message: 'Logged in successfully', user: req.session.user };
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    req.session.destroy(() => {});
    return { message: 'Logged out successfully' };
  }

}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(new AuthGuard('admin'))
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