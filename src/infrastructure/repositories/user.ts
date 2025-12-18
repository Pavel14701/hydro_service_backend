import { Injectable, Inject } from '@nestjs/common';
import { IDataSource, IUsersRepository } from '../../application/interfaces';
import { UserEntity } from '../entities/user';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.dataSource.query<UserEntity>(
          'SELECT * FROM "users"',
        );
  }

  async insert(id: string, name: string, email: string, hashedPassword: string): Promise<UserEntity> {
    const result = await this.dataSource.query<UserEntity>(
      `INSERT INTO "users"(id, name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, "isVerified"`,
      [id, name, email, hashedPassword],
    );
    return result[0];
  }

  async findPasswordByEmail(email: string): Promise<string | null> {
    const result = await this.dataSource.query<{ password: string }>(
      'SELECT password FROM "users" WHERE email = $1',
      [email],
    );
    if (result.length === 0) {
      return null;
    }
    return result[0].password;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
     const result = await this.dataSource.query<UserEntity>(
       'SELECT * FROM "users" WHERE email = $1 LIMIT 1', [email], 
     ); 
     return result.length > 0 ? result[0] : null; }
}
