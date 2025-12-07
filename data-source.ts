import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'mydb',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
});
