import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { AddOrderDto } from './add-order.dto';
import { UpdateOrderDto } from './update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(addOrderDto: AddOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      ...addOrderDto,
      status: 'placed',
    });
    return await this.orderRepository.save(order);
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(id);
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: number): Promise<{ message: string }> {
    const order = await this.getOrderById(id);
    await this.orderRepository.remove(order);
    return { message: 'Order deleted successfully' };
  }
}
