import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DiscountService } from '../application/services/discount';
import { DiscountDto } from '../application/dto';
import {
  CreateServiceDiscountDto,
  CreateCartDiscountDto,
  CreateUserDiscountDto,
  CreateFirstPurchaseDiscountDto,
  CreateTimedDiscountDto,
} from './schemas/discount';
import { AuthGuard } from '../infrastructure/adapters/guard';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get(':id')
  @UseGuards(new AuthGuard('admin'))
  async getById(@Param('id') id: string): Promise<DiscountDto> {
    const dm = await this.discountService.getDiscountById(id);
    return DiscountDto.fromDomain(dm);
  }

  @Get('code/:code')
  @UseGuards(new AuthGuard())
  async getByCode(@Param('code') code: string): Promise<DiscountDto> {
    const dm = await this.discountService.getDiscountByCode(code);
    return DiscountDto.fromDomain(dm);
  }

  @Get()
  @UseGuards(new AuthGuard('admin'))
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<DiscountDto[]> {
    const dms = await this.discountService.getAllDiscounts(Number(page), Number(limit));
    return dms.map(DiscountDto.fromDomain);
  }

  @Post('service')
  @UseGuards(new AuthGuard('admin'))
  async createServiceDiscount(
    @Body() dto: CreateServiceDiscountDto,
  ): Promise<DiscountDto> {
    const dm = await this.discountService.createServiceDiscount(dto.code, dto.percent, dto.serviceId);
    return DiscountDto.fromDomain(dm);
  }

  @Post('cart')
  @UseGuards(new AuthGuard('admin'))
  async createCartDiscount(
    @Body() dto: CreateCartDiscountDto,
  ): Promise<DiscountDto> {
    const dm = await this.discountService.createCartDiscount(dto.code, dto.fixedValue);
    return DiscountDto.fromDomain(dm);
  }

  @Post('user')
  @UseGuards(new AuthGuard('admin'))
  async createUserDiscount(
    @Body() dto: CreateUserDiscountDto,
  ): Promise<DiscountDto> {
    const dm = await this.discountService.createUserDiscount(dto.code, dto.percent, dto.userId);
    return DiscountDto.fromDomain(dm);
  }

  @Post('first-purchase')
  @UseGuards(new AuthGuard('admin'))
  async createFirstPurchaseDiscount(
    @Body() dto: CreateFirstPurchaseDiscountDto,
  ): Promise<DiscountDto> {
    const dm = await this.discountService.createFirstPurchaseDiscount(dto.code, dto.percent);
    return DiscountDto.fromDomain(dm);
  }

  @Post('timed')
  @UseGuards(new AuthGuard('admin'))
  async createTimedDiscount(
    @Body() dto: CreateTimedDiscountDto,
  ): Promise<DiscountDto> {
    const dm = await this.discountService.createTimedDiscount(dto.code, dto.percent, dto.validFrom, dto.validUntil);
    return DiscountDto.fromDomain(dm);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async delete(@Param('id') id: string): Promise<void> {
    return this.discountService.deleteDiscount(id);
  }

  @Get('count/all')
  @UseGuards(new AuthGuard())
  async count(): Promise<{ total: number }> {
    const total = await this.discountService.countDiscounts();
    return { total };
  }
}
