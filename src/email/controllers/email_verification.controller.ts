import { Controller, Get, Query } from '@nestjs/common';
import { EmailVerificationService } from '../application/email-verification.service';

@Controller('auth')
export class EmailVerificationController {
  constructor(private readonly emailVerificationService: EmailVerificationService) {}

  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.emailVerificationService.verifyEmail(token);
  }
}
