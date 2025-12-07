import { Module } from '@nestjs/common';
import { PasswordAdapter } from './password.adapter';

@Module({
  providers: [
    { provide: 'IPasswordAdapter', useClass: PasswordAdapter },
  ],
  exports: ['IPasswordAdapter'],
})
export class SecurityModule {}
