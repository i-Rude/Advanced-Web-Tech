import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { AddProductDto } from './add-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { SellerService } from '../seller/seller.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly sellerService: SellerService,
  ) {}

  async addProduct(productDto: AddProductDto, sellerId: number): Promise<Product> {
    console.log('Adding product for seller ID:', sellerId);
    
    // Verify that the seller exists
    const seller = await this.sellerService.getSellerById(sellerId);
    if (!seller) {
      throw new NotFoundException(`Seller not found with ID ${sellerId}`);
    }
    console.log('Found seller:', seller);

    const product = new Product();
    Object.assign(product, productDto);
    product.seller = seller;
    product.sellerId = seller.id; // Explicitly set the sellerId
    
    console.log('Product before save:', product);
    
    try {
      const savedProduct = await this.productRepository.save(product);
      console.log('Saved product:', savedProduct);
      
      const productWithSeller = await this.productRepository.findOne({
        where: { id: savedProduct.id },
        relations: ['seller']
      });
      
      if (!productWithSeller) {
        throw new NotFoundException('Product not found after saving');
      }
      
      console.log('Final product with seller:', productWithSeller);
      return productWithSeller;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  async updateProduct(id: number, updateData: UpdateProductDto, sellerId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['seller']
    });
    
    if (!product) throw new NotFoundException('Product not found');

    // Check if the authenticated seller owns this product
    if (product.seller.id !== sellerId) {
      throw new ForbiddenException('You can only update your own products');
    }

    Object.assign(product, updateData);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number, sellerId: number): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['seller']
    });
    
    if (!product) throw new NotFoundException('Product not found');

    // Check if the authenticated seller owns this product
    if (product.seller.id !== sellerId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    const result = await this.productRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');

    return { message: 'Product deleted successfully' };
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['seller'] });
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['seller']
    });
  }

  async applyDiscount(productId: number, discount: number, sellerId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id: productId },
      relations: ['seller']
    });
    
    if (!product) throw new NotFoundException('Product not found');

    // Check if the authenticated seller owns this product
    if (product.seller.id !== sellerId) {
      throw new ForbiddenException('You can only apply discount to your own products');
    }

    if (discount < 0 || discount > 100) {
      throw new ForbiddenException('Discount must be between 0 and 100 percent');
    }

    product.discount = discount;
    return await this.productRepository.save(product);
  }

  // Get product with seller relation for authorization checks
  async getProductWithSeller(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller']
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}