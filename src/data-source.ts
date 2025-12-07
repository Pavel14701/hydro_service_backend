// data-source.ts
import { DataSource } from 'typeorm';
import { UserEntity } from './users/infrastructure/user.entity';
import { VerificationToken } from './email/infrastructure/email_verification.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [UserEntity, VerificationToken],
  migrations: ['src/migrations/*.ts'],
});
