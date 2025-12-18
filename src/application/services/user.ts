import { Injectable, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { IPasswordAdapter, IUsersRepository } from '../interfaces';
import { EmailVerificationService } from './email-verification';
import { UserDM } from '../../domain/models';


@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository') private readonly repo: IUsersRepository,
    @Inject('IPasswordAdapter') private readonly passwordService: IPasswordAdapter,
    private readonly mailService: EmailVerificationService,
  ) {}

  async findAll(): Promise<UserDM[]> {
    const entities = await this.repo.findAll();
    return entities.map(
      e => new UserDM(e.id, e.name, e.email, e.role, e.isVerified),
    );
  }

  async create(name: string, email: string, password: string): Promise<UserDM> {
    const id = uuidv7();
    const hashedPassword = await this.passwordService.hash(password);
    const entity = await this.repo.insert(id, name, email, hashedPassword);
    await this.mailService.sendVerificationEmail(entity)
    return new UserDM(entity.id, entity.name, entity.email, entity.role, entity.isVerified);
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


  async login(email: string, plain: string): Promise<UserDM> { 
  const entity = await this.repo.findByEmail(email); 
  if (!entity) { throw new UnauthorizedException('User not found'); 
  } const isValid = await this.validatePasswordByEmail(email, plain); 
    if (!isValid) { throw new UnauthorizedException('Invalid credentials'); 
  } 
  return new UserDM(
    entity.id, 
    entity.name, 
    entity.email, 
    entity.role, 
    entity.isVerified); 
  } 
}

