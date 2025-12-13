// src/email/infrastructure/email-verification.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { IEmailVerificationRepository } from '../../application/interfaces';
import { IDataSource } from '../../application/interfaces';

@Injectable()
export class EmailVerificationRepository implements IEmailVerificationRepository {
  constructor(@Inject('IDataSource') private readonly dataSource: IDataSource) {}

  async saveToken(token: string, userId: string): Promise<void> {
    await this.dataSource.query(
      'INSERT INTO "verification_tokens"(token, "userId") VALUES ($1, $2)',
      [token, userId],
    );
  }

  async findToken(token: string): Promise<any> {
    const result = await this.dataSource.query(
      'SELECT * FROM "verification_tokens" WHERE token = $1 AND used = false',
      [token],
    );
    return result[0];
  }

  async markTokenUsed(id: string): Promise<void> {
    await this.dataSource.query(
      'UPDATE "verification_tokens" SET used = true WHERE id = $1',
      [id],
    );
  }

  async verifyUser(userId: string): Promise<void> {
    await this.dataSource.query(
      'UPDATE "users" SET "isVerified" = true WHERE id = $1',
      [userId],
    );
  }
}
