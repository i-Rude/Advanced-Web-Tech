import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    AdminModule , ProductModule, CustomerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
