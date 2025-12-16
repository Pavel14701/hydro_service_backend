import { IsUUID, IsOptional, IsNumber, Min, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPurchasesQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 20;

  @IsOptional()
  @IsEnum(['id', 'purchasedAt', 'amount'])
  sortBy: 'id' | 'purchasedAt' | 'amount' = 'purchasedAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}

export class CreatePurchaseDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  serviceId!: string;

  @IsOptional()
  @IsUUID()
  discountId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  purchasedAt?: Date;
}
