import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TypeOrmDataSource } from './infrastructure/adapters/db';
import { UsersRepository } from './infrastructure/repositories/users';
import { AuthController, EmailVerificationController, UsersController } from './controllers/user';
import { UsersService } from './application/services/user';
import { EmailVerificationService } from './application/services/email-verification';
import { EmailVerificationRepository } from './infrastructure/repositories/email-verification';
import { MailService } from './infrastructure/adapters/mail';
import { PasswordAdapter } from './infrastructure/adapters/password';
import { DiscountRepository } from './infrastructure/repositories/discount';


@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
            const raw = config.get<string>('DB_PORT', '5432');
            const parsed = Number(raw);
            const port = Number.isInteger(parsed) && parsed > 0 && parsed < 65536 ? parsed : 5432;
            return {
            type: 'postgres',
            host: config.get('DB_HOST', 'localhost'),
            port,
            username: config.get('DB_USER', 'postgres'),
            password: config.get('DB_PASS', 'postgres'),
            database: config.get('DB_NAME', 'mydb'),
            entities: [__dirname + '/../**/*{.entity.ts,.entity.js,entities.ts}'], 
            synchronize: false,
            };
        },
    }),
  ],
  providers: [
    {
      provide: 'IDataSource',
      useFactory: (ds: DataSource) => new TypeOrmDataSource(ds),
      inject: [DataSource],
    },
  ],
  exports: ['IDataSource'],
})
export class DatabaseModule {}


@Module({
  imports: [DatabaseModule],
  controllers: [EmailVerificationController],
  providers: [
    EmailVerificationService,
    {
      provide: 'IEmailVerificationRepository',
      useClass: EmailVerificationRepository,
    },
    {
      provide: 'IMailService',
      useClass: MailService,
    },
  ],
  exports: [EmailVerificationService],
})
export class EmailModule {}


@Module({
  providers: [
    { provide: 'IPasswordAdapter', useClass: PasswordAdapter },
  ],
  exports: ['IPasswordAdapter'],
})
export class SecurityModule {}


@Module({
  imports: [SecurityModule, EmailModule, DatabaseModule],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}


@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'IDiscountRepository',
      useClass: DiscountRepository
    }
  ]
})
export class DiscountModule {}

@Module({
    imports: [DatabaseModule],
    providers: 
    [],
    exports: []
})
export class ServiceModule {}


@Module({
    imports: [DatabaseModule],
    providers: [

    ],
    exports: []
})
export class CategoryModule {}


@Module({
    imports: [DatabaseModule],
    providers: [

    ],
    exports: []
})
export class SubcategoryModule {}


@Module({
    imports: [DatabaseModule],
    providers: [

    ],
    exports: []
})
export class ProductModule {}
