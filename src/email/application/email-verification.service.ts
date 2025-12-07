// src/email/application/email-verification.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../../users/infrastructure/user.entity';
import { IEmailVerificationRepository } from './email-verification.repository.interface';
import { IMailService } from './mail.adapter.interface';

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject('IEmailVerificationRepository')
    private readonly repo: IEmailVerificationRepository,
    @Inject('IMailService')
    private readonly mailService: IMailService,
  ) {}

  async sendVerificationEmail(user: UserEntity) {
    const token = uuidv7();
    await this.repo.saveToken(token, user.id);

    const link = `${process.env.APP_URL}/auth/verify?token=${token}`;
    const html = `
      <h1>Email Verification</h1>
      <p>Привет, ${user.name}!</p>
      <p>Для подтверждения почты перейди по ссылке:</p>
      <a href="${link}">${link}</a>
    `;

    await this.mailService.sendMail(user.email, 'Verify your email', html);
  }

  async verifyEmail(token: string) {
    const record = await this.repo.findToken(token);
    if (!record) {
      throw new BadRequestException('Неверный или использованный токен');
    }
    await this.repo.verifyUser(record.userId);
    await this.repo.markTokenUsed(record.id);
    return { message: 'Email подтверждён' };
  }
}
