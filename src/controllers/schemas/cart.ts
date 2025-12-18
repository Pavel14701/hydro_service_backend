import { IsUUID } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  serviceId!: string;
}
