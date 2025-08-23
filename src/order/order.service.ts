// src/order/order.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';
import { Customer } from '../customer/customer.entity';
import { AddOrderDto } from './add-order.dto';
import { UpdateOrderDto } from './update-order.dto';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createOrder(addOrderDto: AddOrderDto, customerId?: string): Promise<Order> {
    // Get all product IDs from the order
    const productIds = addOrderDto.items.map(item => item.productId);
    
    // Fetch all products at once
    const products = await this.productRepository.find({
      where: { id: In(productIds) },
      relations: ['seller'],
    });

    // Validate all products exist
    if (products.length !== productIds.length) {
      const foundIds = products.map(p => p.id);
      const missingIds = productIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Products not found: ${missingIds.join(', ')}`);
    }

    // Create order items and calculate total
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const itemDto of addOrderDto.items) {
      const product = products.find(p => p.id === itemDto.productId);
      
      if (!product) continue;

      // Check stock availability
      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
      }

      // Calculate prices with discount
      const unitPrice = product.price * (1 - product.discount / 100);
      const itemTotal = unitPrice * itemDto.quantity;

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: itemDto.quantity,
        unitPrice,
        totalPrice: itemTotal,
      });

      orderItems.push(orderItem);
      totalAmount += itemTotal;

      // Update product stock immediately
      product.stock -= itemDto.quantity;
      await this.productRepository.save(product);
    }

    // Find customer if customerId is provided
    let customer: Customer | null = null;
    if (customerId) {
      customer = await this.customerRepository.findOne({ where: { id: customerId } });
    }

    // Create the order
    const order = this.orderRepository.create({
      customer: customer || undefined,
      customerName: addOrderDto.customerName,
      customerEmail: addOrderDto.customerEmail,
      shippingAddress: addOrderDto.shippingAddress,
      phoneNumber: addOrderDto.phoneNumber,
      paymentMethod: addOrderDto.paymentMethod,
      totalAmount,
      orderItems,
    });

    return await this.orderRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product', 'orderItems.product.seller', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product', 'orderItems.product.seller', 'customer'],
    });
    
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(id);
    
    // If status is being changed to cancelled, restore stock
    if (updateOrderDto.status === 'cancelled' && order.status !== 'cancelled') {
      await this.restoreProductStock(order);
    }
    
    // If status is being changed from cancelled to another status, deduct stock again
    if (order.status === 'cancelled' && updateOrderDto.status !== 'cancelled') {
      await this.deductProductStock(order);
    }

    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: number): Promise<{ message: string }> {
    const order = await this.getOrderById(id);
    
    // Restore product stock if order is not cancelled
    if (order.status !== 'cancelled') {
      await this.restoreProductStock(order);
    }

    await this.orderRepository.remove(order);
    return { message: 'Order deleted successfully' };
  }

  async getOrdersByCustomer(email: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customerEmail: email },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersBySeller(sellerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product'],
      where: {
        orderItems: {
          product: {
            seller: { id: sellerId }
          }
        }
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(id: number, status: string, sellerId?: number): Promise<Order> {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const order = await this.getOrderById(id);

    // If seller is provided, verify they have products in this order
    if (sellerId) {
      const hasProductsFromSeller = order.orderItems.some(
        item => item.product.seller.id === sellerId
      );
      
      if (!hasProductsFromSeller) {
        throw new ForbiddenException('You can only update orders containing your products');
      }
    }

    // Handle stock management based on status changes
    if (status === 'cancelled' && order.status !== 'cancelled') {
      await this.restoreProductStock(order);
    } else if (order.status === 'cancelled' && status !== 'cancelled') {
      await this.deductProductStock(order);
    }

    order.status = status as any;
    return await this.orderRepository.save(order);
  }

  private async restoreProductStock(order: Order): Promise<void> {
    for (const item of order.orderItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.product.id },
      });
      
      if (product) {
        product.stock += item.quantity;
        await this.productRepository.save(product);
      }
    }
  }

  private async deductProductStock(order: Order): Promise<void> {
    for (const item of order.orderItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.product.id },
      });
      
      if (product) {
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
        }
        
        product.stock -= item.quantity;
        await this.productRepository.save(product);
      }
    }
  }
}