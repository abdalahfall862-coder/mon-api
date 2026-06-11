import { IsString, IsNumber, IsInt, IsOptional, Min, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @IsPositive()
  categoryId: number;
}