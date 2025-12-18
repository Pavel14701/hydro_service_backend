import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../infrastructure/adapters/guard';
import { CartService } from '../application/services/cart';
import { CartDto } from '../application/dto';
import { PurchaseDto } from '../application/dto';
import { AddToCartDto } from './schemas/cart';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':id')
  @UseGuards(new AuthGuard('admin'))
  async getById(@Param('id') id: string): Promise<CartDto> {
    const dm = await this.cartService.getCartById(id);
    return CartDto.fromDomain(dm);
  }

  @Get()
  @UseGuards(new AuthGuard('admin'))
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('sortBy') sortBy: 'id' = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<CartDto[]> {
    const dms = await this.cartService.getCartPaginated(Number(page), Number(limit), sortBy, sortOrder);
    return dms.map(CartDto.fromDomain);
  }

  @Get('user/:userId')
  @UseGuards(new AuthGuard())
  async getByUser(
    @Param('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<CartDto[]> {
    const dms = await this.cartService.getCartByUser(userId, Number(page), Number(limit));
    return dms.map(CartDto.fromDomain);
  }

  @Get('count/all')
  @UseGuards(new AuthGuard())
  async countAll(): Promise<{ total: number }> {
    const total = await this.cartService.countCart();
    return { total };
  }

  @Get('count/user/:userId')
  @UseGuards(new AuthGuard())
  async countByUser(@Param('userId') userId: string): Promise<{ total: number }> {
    const total = await this.cartService.countCartByUser(userId);
    return { total };
  }

  @Post()
  @UseGuards(new AuthGuard())
  async add(@Body() dto: AddToCartDto): Promise<CartDto> {
    const dm = await this.cartService.addToCart(dto);
    return CartDto.fromDomain(dm);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard('admin'))
  async remove(@Param('id') id: string): Promise<void> {
    return this.cartService.removeFromCart(id);
  }

  @Delete('user/:userId/service/:serviceId')
  @UseGuards(new AuthGuard())
  async removeByUserAndService(
    @Param('userId') userId: string,
    @Param('serviceId') serviceId: string,
  ): Promise<void> {
    return this.cartService.removeByUserAndService(userId, serviceId);
  }

  @Post('checkout/:userId')
  @UseGuards(new AuthGuard())
  async checkout(@Param('userId') userId: string): Promise<PurchaseDto[]> {
    const dms = await this.cartService.checkout(userId);
    return dms.map(PurchaseDto.fromDomain);
  }
}
