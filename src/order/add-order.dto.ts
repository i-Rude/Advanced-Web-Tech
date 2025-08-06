import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class AddOrderDto {
  @IsNotEmpty()
  customerName: string;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalPrice: number;
}
