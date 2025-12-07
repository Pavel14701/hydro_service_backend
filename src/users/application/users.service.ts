// src/users/application/users.service.ts
import { Injectable, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../domain/user';
import { uuidv7 } from 'uuidv7';
import { IPasswordAdapter } from '../../security/password.adapter.interface';
import { EmailVerificationService } from '../../email/application/email-verification.service';
import { IUsersRepository } from './users.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository') private readonly repo: IUsersRepository,
    @Inject('IPasswordAdapter') private readonly passwordService: IPasswordAdapter,
    private readonly mailService: EmailVerificationService,
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.repo.findAll();
    return entities.map(
      e => new User(e.id, e.name, e.email, e.role, e.isVerified),
    );
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const id = uuidv7();
    const hashedPassword = await this.passwordService.hash(password);
    const entity = await this.repo.insert(id, name, email, hashedPassword);
    await this.mailService.sendVerificationEmail(entity)
    return new User(entity.id, entity.name, entity.email, entity.role, entity.isVerified);
  }

  async validatePasswordByEmail(email: string, plain: string): Promise<boolean> {
    const hash = await this.repo.findPasswordByEmail(email);
    if (!hash) {
      throw new BadRequestException('User has no password');
    }
    const isValid = await this.passwordService.verify(hash, plain);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return true;
  }
}