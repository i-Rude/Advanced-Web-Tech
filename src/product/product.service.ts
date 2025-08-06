import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { AddProductDto } from './add-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addProduct(productDto: AddProductDto): Promise<Product> {
    const product = this.productRepository.create(productDto);
    return await this.productRepository.save(product);
  }

  async updateProduct(id: number, updateData: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    Object.assign(product, updateData);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');

    return { message: 'Product deleted successfully' };
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }
}
