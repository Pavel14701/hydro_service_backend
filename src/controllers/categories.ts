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
import { CategoriesService } from '../application/services/categories';
import { CategoryWithCountDto, CategoryDto } from '../application/dto';
import { CreateCategoryRequest, UpdateCategoryRequest, GetCategoriesQuery } from './schemas/categories';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(@Query() query: GetCategoriesQuery): Promise<CategoryDto[]> {
    const categories = await this.categoriesService.getCategories(
      query.page,
      query.limit,
      query.sortBy as any,
      query.sortOrder,
    );
    return categories.map(CategoryDto.fromDomain);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<CategoryDto> {
    const category = await this.categoriesService.getCategoryById(id);
    return CategoryDto.fromDomain(category);
  }

  @Post()
  async createCategory(@Body() body: CreateCategoryRequest): Promise<CategoryDto> {
    const category = await this.categoriesService.createCategory(body.name);
    return CategoryDto.fromDomain(category);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() body: UpdateCategoryRequest): Promise<CategoryDto> {
    const category = await this.categoriesService.updateCategory(id, body.name);
    return CategoryDto.fromDomain(category);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.categoriesService.deleteCategory(id);
  }

  @Get('meta/count')
  async countCategories() {
    return { total: await this.categoriesService.countCategories() };
  }

  @Get('meta/with-subcategory-count')
  async getCategoriesWithSubcategoryCount(): Promise<CategoryWithCountDto[]> {
    const categories = await this.categoriesService.getCategoriesWithSubcategoryCount();
    return categories.map(CategoryWithCountDto.fromDomain);
  }

  @Get('meta/empty')
  async getEmptyCategories(): Promise<CategoryDto[]> {
    const categories = await this.categoriesService.getEmptyCategories();
    return categories.map(CategoryDto.fromDomain);
  }
}
