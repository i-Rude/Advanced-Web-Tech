import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;

  @IsOptional()
  @IsEnum(['pending', 'processing', 'completed', 'cancelled'], { message: 'Invalid status' })
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
}
