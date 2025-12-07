// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailVerificationService } from './application/email-verification.service';
import { EmailVerificationRepository } from './infrastructure/email-verification.repository';
import { EmailVerificationController } from './controllers/email_verification.controller';
import { MailService } from './infrastructure/mail.service';

@Module({
  controllers: [EmailVerificationController],
  providers: [
    EmailVerificationService,
    {
      provide: 'IEmailVerificationRepository',
      useClass: EmailVerificationRepository,
    },
    {
      provide: 'IMailService',
      useClass: MailService,
    },
  ],
  exports: [EmailVerificationService],
})
export class EmailModule {}
