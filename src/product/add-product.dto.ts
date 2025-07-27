import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsOptional()
  file?: string; 
}