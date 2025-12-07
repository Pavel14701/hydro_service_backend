import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(): Promise<User[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const users = await queryRunner.query('SELECT * FROM "user"');
      return users;
    } finally {
      await queryRunner.release();
    }
  }

  async create(name: string, email: string): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const id = uuidv7();
      await queryRunner.query(
        'INSERT INTO "user"(id, name, email) VALUES ($1, $2, $3)',
        [id, name, email],
      );
      await queryRunner.commitTransaction();
      return { id, name, email } as User;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
