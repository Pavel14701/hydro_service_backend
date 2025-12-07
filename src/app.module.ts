// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { SecurityModule } from './security/security.module';

import { UserEntity } from './users/infrastructure/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'mydb',
      entities: [UserEntity],
      synchronize: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    EmailModule,
    SecurityModule,
  ],
})
export class AppModule {}
