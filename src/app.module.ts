// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, DiscountModule, EmailModule, SecurityModule, UsersModule } from './ioc';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    EmailModule,
    SecurityModule,
    DiscountModule,
  ],
})
export class AppModule {}
