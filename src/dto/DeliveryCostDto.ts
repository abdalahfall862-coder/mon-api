import { IsString, IsEnum } from 'class-validator';

export enum DeliveryType {
  PICKUP = 'pickup',
  YANGO = 'yango',
  EXPRESS = 'express',
  STANDARD = 'standard'
}

export class DeliveryCostDto {
  @IsString()
  city: string;

  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;
}