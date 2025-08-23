// src/customer/customer.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Customer]),
        forwardRef(() => OrderModule),
    ],
    controllers: [CustomerController],
    providers: [CustomerService],
    exports: [TypeOrmModule, CustomerService], // Export TypeOrmModule and CustomerService
})
export class CustomerModule {}