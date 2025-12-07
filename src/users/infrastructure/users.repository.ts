// src/users/infrastructure/users.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { IUsersRepository } from '../application/users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(): Promise<UserEntity[]> {
    return this.dataSource.query('SELECT * FROM "users"');
  }

  async insert(id: string, name: string, email: string, hashedPassword: string): Promise<UserEntity> {
  const result = await this.dataSource.query(
      'INSERT INTO "users"(id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, "isVerified"',
      [id, name, email, hashedPassword],
    );
    return result[0] as UserEntity;
  }

  async findPasswordByEmail(email: string): Promise<string | null> {
    const result = await this.dataSource.query(
      'SELECT password FROM "users" WHERE email = $1',
      [email],
    );
    if (result.length === 0) {
      return null;
    }
    return result[0].password as string;
  }
}
