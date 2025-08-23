import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AddOrderDto } from './add-order.dto';
import { UpdateOrderDto } from './update-order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Public endpoint - anyone can create orders
  @Post()
  async createOrder(@Body() addOrderDto: AddOrderDto, @Request() req) {
    // If user is authenticated, associate with customer
    const customerId = req.user?.sub && req.user.role === 'customer' ? req.user.sub : undefined;
    return await this.orderService.createOrder(addOrderDto, customerId);
  }

  // Admin only - view all orders
  @Get()
  @UseGuards(AuthGuard)
  @Roles('admin')
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  // Get order by ID - admin, seller, or the customer who placed it
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrderById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const order = await this.orderService.getOrderById(id);
    
    // Allow admin, seller with products in order, or the customer who placed it
    if (req.user.role === 'admin') {
      return order;
    }
    
    if (req.user.role === 'seller') {
      const hasProductsFromSeller = order.orderItems.some(
        item => item.product.seller.id === req.user.sub
      );
      
      if (hasProductsFromSeller) {
        return order;
      }
    }
    
    if (req.user.role === 'customer' && order.customerEmail === req.user.email) {
      return order;
    }
    
    throw new UnauthorizedException('Access denied');
  }

  // Customer can view their own orders
  @Get('customer/my-orders')
  @UseGuards(AuthGuard)
  @Roles('customer')
  async getMyOrders(@Request() req) {
    return await this.orderService.getOrdersByCustomerId(req.user.sub);
  }

  // Seller can view orders containing their products
  @Get('seller/my-orders')
  @UseGuards(AuthGuard)
  @Roles('seller')
  async getSellerOrders(@Request() req) {
    return await this.orderService.getOrdersBySeller(req.user.sub);
  }

  // Admin only - update order
  @Put(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.updateOrder(id, updateOrderDto);
  }

  // Update order status - admin or seller
  @Patch(':id/status')
  @UseGuards(AuthGuard)
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @Request() req
  ) {
    const sellerId = req.user.role === 'seller' ? req.user.sub : undefined;
    return await this.orderService.updateOrderStatus(id, status, sellerId);
  }

  // Admin only - delete order
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.deleteOrder(id);
  }
}