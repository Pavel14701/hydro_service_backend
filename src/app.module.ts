// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { SecurityModule } from './security/security.module';

import { UserEntity } from './users/infrastructure/user.entity';

function getValidPort(envPort: string | undefined, defaultPort: number): number {
  const port = Number(envPort);
  return Number.isInteger(port) && port > 0 && port < 65536 ? port : defaultPort;
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: getValidPort(process.env.DB_PORT, 5432),
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
