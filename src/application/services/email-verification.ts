// src/email/application/email-verification.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../../infrastructure/entities';
import { IEmailVerificationRepository, IMailService } from '../interfaces';

@Injectable()
export class EmailVerificationService {
  private readonly appUrl: string;

  constructor(
    @Inject('IEmailVerificationRepository')
    private readonly repo: IEmailVerificationRepository,
    @Inject('IMailService')
    private readonly mailService: IMailService,
    private readonly configService: ConfigService,
  ) {
    const appUrl = this.configService.get<string>('APP_URL');

    if (!appUrl) {
      throw new Error('APP_URL environment variable is not configured');
    }

    try {
      const url = new URL(appUrl);
      this.appUrl = url.toString().replace(/\/+$/, '');
    } catch {
      throw new Error('APP_URL environment variable is not a valid URL');
    }
  }

  async sendVerificationEmail(user: UserEntity) {
    const token = uuidv7();
    await this.repo.saveToken(token, user.id);

    const link = `${this.appUrl}/auth/verify?token=${token}`;
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
      throw new Error('Неверный или использованный токен');
    }
    await this.repo.verifyUser(record.userId);
    await this.repo.markTokenUsed(record.id);
    return { message: 'Email подтверждён' };
  }
}
