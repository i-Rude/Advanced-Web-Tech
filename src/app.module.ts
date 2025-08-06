import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin/admin.entity';
import { Seller } from './seller/seller.entity';
import { Product } from './product/product.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type:'postgres',
      host: 'localhost',
      port: 5432,
      username:'postgres',
      password:'admin',
      database:'ecommerce',
      entities:[Admin,Seller,Product ],
      synchronize:true,


    })

    ,
    AdminModule , ProductModule, CustomerModule],
  controllers: [],
  providers: [],
  
})
export class AppModule {}
