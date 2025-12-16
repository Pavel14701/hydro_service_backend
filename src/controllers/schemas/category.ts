// src/application/dto/category-requests.dto.ts
import { IsString, IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryRequest {
  @IsString()
  name!: string;
}

export class UpdateCategoryRequest {
  @IsString()
  name!: string;
}

export class GetCategoriesQuery {
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

  @IsString()
  @IsOptional()
  sortBy: string = 'name';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}
