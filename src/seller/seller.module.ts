import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './seller.entity';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seller]),
 forwardRef(() => AdminModule)],
  controllers: [SellerController],
  providers: [SellerService],
  exports:[SellerService],
})
export class SellerModule {}
