import { IsString, IsUUID, IsOptional, IsInt, Min, IsIn, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubcategoryRequest {
  @IsString()
  name!: string;

  @IsUUID()
  categoryId!: string;
}

export class UpdateSubcategoryRequest {
  @IsString()
  name!: string;

  @IsUUID()
  categoryId!: string;
}

export class GetSubcategoriesQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 20;

  @IsOptional()
  @IsEnum(['id', 'name', 'categoryId']) // допустимые поля сортировки
  sortBy: 'id' | 'name' | 'categoryId' = 'name';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}