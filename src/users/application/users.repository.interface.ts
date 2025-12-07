import { UserEntity } from '../infrastructure/user.entity';

export interface IUsersRepository {
  findAll(): Promise<UserEntity[]>;
  insert(id: string, name: string, email: string, hashedPassword: string): Promise<UserEntity>;
}
