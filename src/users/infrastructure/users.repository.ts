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
    await this.dataSource.query(
      'INSERT INTO "users"(id, name, email, password) VALUES ($1, $2, $3, $4)',
      [id, name, email, hashedPassword],
    );
    return { id, name, email, password: hashedPassword } as UserEntity;
  }
}
