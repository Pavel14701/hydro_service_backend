import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { SubcategoriesService } from '../application/services/subcategories';
import {
  SubcategoryDto,
  SubcategoryWithCategoryNameDto,
} from '../application/dto';
import {
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest,
  GetSubcategoriesQuery,
} from './schemas/subcategories';


@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Get()
  async getSubcategories(@Query() query: GetSubcategoriesQuery): Promise<SubcategoryDto[]> {
    const subs = await this.subcategoriesService.getSubcategories(
      query.page,
      query.limit,
      query.sortBy as any,
      query.sortOrder,
    );
    return subs.map(SubcategoryDto.fromDomain);
  }

  @Get(':id')
  async getSubcategoryById(@Param('id') id: string): Promise<SubcategoryDto> {
    const sub = await this.subcategoriesService.getSubcategoryById(id);
    return SubcategoryDto.fromDomain(sub);
  }

  @Post()
  async createSubcategory(@Body() body: CreateSubcategoryRequest): Promise<SubcategoryDto> {
    const sub = await this.subcategoriesService.createSubcategory(body.name, body.categoryId);
    return SubcategoryDto.fromDomain(sub);
  }

  @Put(':id')
  async updateSubcategory(@Param('id') id: string, @Body() body: UpdateSubcategoryRequest): Promise<SubcategoryDto> {
    const sub = await this.subcategoriesService.updateSubcategory(id, body.name, body.categoryId);
    return SubcategoryDto.fromDomain(sub);
  }

  @Delete(':id')
  async deleteSubcategory(@Param('id') id: string): Promise<void> {
    await this.subcategoriesService.deleteSubcategory(id);
  }

  @Get('meta/count')
  async countSubcategories() {
    return { total: await this.subcategoriesService.countSubcategories() };
  }

  @Get('meta/with-category-name')
  async getSubcategoriesWithCategoryName(): Promise<SubcategoryWithCategoryNameDto[]> {
    const subs = await this.subcategoriesService.getSubcategoriesWithCategoryName();
    return subs.map(SubcategoryWithCategoryNameDto.fromDomain);
  }
}
