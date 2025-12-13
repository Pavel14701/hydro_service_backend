// src/infrastructure/database/typeorm.datasource.ts
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, EntityManager } from 'typeorm';
import { IDataSource } from '../../application/interfaces';


@Injectable()
export class TypeOrmDataSource implements IDataSource {
  private queryRunner: QueryRunner | null = null;

  constructor(private readonly ds: DataSource) {}

  /**
   * Выполнить SQL. Если есть активный QueryRunner (транзакция), использовать его,
   * иначе — DataSource.query.
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (this.queryRunner) {
      return this.queryRunner.query(sql, params) as Promise<T[]>;
    }
    return this.ds.query(sql, params) as Promise<T[]>;
  }

  /**
   * Удобный wrapper для транзакций: принимает колбэк с EntityManager и возвращает результат.
   * Использует встроенный DataSource.transaction (EntityManager).
   */
  async transaction<T>(cb: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.ds.transaction(async (manager: EntityManager) => {
      return cb(manager);
    });
  }

  /**
   * Явное управление транзакцией через QueryRunner.
   * begin/commit/rollback полезны, если нужен ручной контроль и lockRow через queryRunner.
   */
  async beginTransaction(): Promise<void> {
    if (this.queryRunner) {
      // уже есть открытая транзакция
      return;
    }
    this.queryRunner = this.ds.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    if (!this.queryRunner) return;
    try {
      await this.queryRunner.commitTransaction();
    } finally {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.queryRunner) return;
    try {
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  /**
   * Захват row-level lock внутри текущей транзакции.
   * Требует, чтобы транзакция была начата через beginTransaction (QueryRunner).
   */
  async lockRow(table: string, id: string | number, mode: 'FOR UPDATE' | 'FOR SHARE' = 'FOR UPDATE'): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('Transaction not started. Call beginTransaction() before lockRow().');
    }
    // Простой SELECT ... FOR UPDATE
    await this.queryRunner.query(`SELECT * FROM "${table}" WHERE id = $1 ${mode}`, [id]);
  }

  /**
   * Advisory locks (Postgres)
   */
  async acquireAdvisoryLock(key: number): Promise<void> {
    await this.ds.query('SELECT pg_advisory_lock($1)', [key]);
  }

  async releaseAdvisoryLock(key: number): Promise<void> {
    await this.ds.query('SELECT pg_advisory_unlock($1)', [key]);
  }
}
