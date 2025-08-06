import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';
import { AddSellerDto } from './add-seller.dto';
import { UpdateSellerDto } from './update-seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async createSeller(addSellerDto: AddSellerDto): Promise<Seller> {
    const emailExists = await this.sellerRepository.findOne({ where: { email: addSellerDto.email } });
    if (emailExists) throw new ConflictException('Email already in use');

    const seller = this.sellerRepository.create({
      ...addSellerDto,
      phone: Number(addSellerDto.phone),
    });
    return await this.sellerRepository.save(seller);
  }

  async findAll(): Promise<Seller[]> {
    return await this.sellerRepository.find();
  }

  async getSellerById(id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({ where: { id } });
    if (!seller) throw new NotFoundException('Seller not found');
    return seller;
  }

  async updateSeller(id: number, updateSellerDto: UpdateSellerDto): Promise<Seller> {
    const seller = await this.getSellerById(id);

    Object.assign(seller, updateSellerDto);
    return await this.sellerRepository.save(seller);
  }

  async deactivateSeller(id: number): Promise<Seller> {
    const seller = await this.getSellerById(id);
    seller.status = 'inactive';
    return await this.sellerRepository.save(seller);
  }

  async getActiveSellers(): Promise<Seller[]> {
    return await this.sellerRepository.find({ where: { status: 'active' } });
  }
}
