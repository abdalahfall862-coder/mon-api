import { IsString, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
    @IsString()
    street: string;

    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    zipCode?: string;

    @IsOptional()
    @IsString()
    country?: string;
}

export class CreateOrderDto {
    @ValidateNested()
    @Type(() => AddressDto)
    shippingAddress: AddressDto;

    @IsOptional()
    @IsString()
    paymentMethod?: string;

    @IsOptional()
    @IsString()
    deliveryType?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}