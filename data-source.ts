// data-source.ts
import { DataSource } from 'typeorm';
import { UserEntity } from './src/users/infrastructure/user.entity';
import { VerificationToken } from './src/email/infrastructure/email_verification.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [UserEntity, VerificationToken],
  migrations: ['src/migrations/*.ts'],
});
