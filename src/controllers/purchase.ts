import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from '../application/services/purchase';
import { PurchaseDto } from '../application/dto';
import { GetPurchasesQuery, CreatePurchaseDto } from './schemas/purchase';
import { AuthGuard } from '../infrastructure/adapters/guard';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get(':id')
  @UseGuards(new AuthGuard('admin'))
  async getById(@Param('id') id: string): Promise<PurchaseDto> {
    const dm = await this.purchaseService.getPurchaseById(id);
    return PurchaseDto.fromDomain(dm);
  }

  @Get()
  @UseGuards(new AuthGuard('admin'))
  async getAll(@Query() query: GetPurchasesQuery): Promise<PurchaseDto[]> {
    const dms = await this.purchaseService.getPurchasesPaginated(
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
    );
    return dms.map(PurchaseDto.fromDomain);
  }

  @Get('user/:userId')
  @UseGuards(new AuthGuard())
  async getByUser(
    @Param('userId') userId: string,
    @Query() query: GetPurchasesQuery,
  ): Promise<PurchaseDto[]> {
    const dms = await this.purchaseService.getPurchasesByUser(userId, query.page, query.limit);
    return dms.map(PurchaseDto.fromDomain);
  }

  @Get('count/all')
  @UseGuards(new AuthGuard('admin'))
  async countAll(): Promise<{ total: number }> {
    const total = await this.purchaseService.countPurchases();
    return { total };
  }

  @Get('count/user/:userId')
  @UseGuards(new AuthGuard())
  async countByUser(@Param('userId') userId: string): Promise<{ total: number }> {
    const total = await this.purchaseService.countPurchasesByUser(userId);
    return { total };
  }

  @Post()
  @UseGuards(new AuthGuard())
  async create(@Body() dto: CreatePurchaseDto): Promise<PurchaseDto> {
    const dm = await this.purchaseService.createPurchase(dto);
    return PurchaseDto.fromDomain(dm);
  }
}
