import { IsString, IsNumber, IsUUID, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Скидка на сервис
export class CreateServiceDiscountDto {
  @IsString()
  code!: string;

  @IsNumber()
  @Min(1)
  percent!: number;

  @IsUUID()
  serviceId!: string;
}

// Скидка на корзину
export class CreateCartDiscountDto {
  @IsString()
  code!: string;

  @IsNumber()
  @Min(1)
  fixedValue!: number;
}

// Скидка для пользователя
export class CreateUserDiscountDto {
  @IsString()
  code!: string;

  @IsNumber()
  @Min(1)
  percent!: number;

  @IsUUID()
  userId!: string;
}

// Скидка только для первой покупки
export class CreateFirstPurchaseDiscountDto {
  @IsString()
  code!: string;

  @IsNumber()
  @Min(1)
  percent!: number;
}

// Временная скидка
export class CreateTimedDiscountDto {
  @IsString()
  code!: string;

  @IsNumber()
  @Min(1)
  percent!: number;

  @Type(() => Date)
  @IsDate()
  validFrom!: Date;

  @Type(() => Date)
  @IsDate()
  validUntil!: Date;
}
