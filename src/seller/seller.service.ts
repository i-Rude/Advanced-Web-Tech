import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Seller } from './seller.entity';
import { AddSellerDto } from './add-seller.dto';
import { UpdateSellerDto } from './update-seller.dto';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admin/admin.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class SellerService {
  private readonly salt = 10;
  private readonly logger = new Logger(SellerService.name);

  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
    private mailService: MailService,
  ) {}

   async createSeller(addSellerDto: AddSellerDto, adminId: number): Promise<Seller> {
    if (!addSellerDto.password) {
      throw new BadRequestException('Password is required');
    }

    const [emailExists, nidExists] = await Promise.all([
      this.sellerRepository.findOne({ where: { email: addSellerDto.email } }),
      this.sellerRepository.findOne({ where: { nid: addSellerDto.nid } }),
    ]);
    if (emailExists) throw new ConflictException('Email already exists');
    if (nidExists) throw new ConflictException('NID already exists');

    const seller = new Seller();
    seller.name = addSellerDto.name;
    seller.email = addSellerDto.email;
    seller.password = await bcrypt.hash(addSellerDto.password, this.salt);
    seller.phone = Number(addSellerDto.phone);
    seller.nid = addSellerDto.nid;
    seller.fileName = addSellerDto.fileName;

    const admin = await this.adminService.getAdminById(adminId);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }
    seller.admin = admin;

    const savedSeller = await this.sellerRepository.save(seller);
    
    // Send welcome email
    try {
      await this.mailService.sendSellerWelcomeEmail(
        savedSeller.email, 
        addSellerDto.password
      );
    } catch (error) {
      this.logger.error('Failed to send welcome email to seller', error);
      // Don't throw error as seller creation was successful
    }
    
    return this.sellerRepository.findOneOrFail({
      where: { id: savedSeller.id },
      relations: ['admin'],
    });
  }

  async changeSellerStatus(
    id: number,
    status: 'active' | 'inactive',
    adminId: number,
  ): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({
      where: { id },
      relations: ['admin'],
    });
    if (!seller) throw new NotFoundException('Seller not found');

    // Admin can only modify their own sellers
    if (!seller.admin || seller.admin.id !== adminId) {
      throw new UnauthorizedException('You can only update your own sellers');
    }

    seller.status = status;
    return this.sellerRepository.save(seller);
  }

  async findAll(): Promise<Seller[]> {
    return this.sellerRepository.find({ relations: ['admin'] });
  }

  async getSellerById(id: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({ where: { id }, relations: ['admin'] });
    if (!seller) throw new NotFoundException('Seller not found');
    return seller;
  }

  async updateSeller(id: number, updateSellerdto: UpdateSellerDto, adminId: number): Promise<Seller> {
    const seller = await this.sellerRepository.findOne({ where: { id }, relations: ['admin'] });
    if (!seller) throw new NotFoundException('Seller not found');

    if (!seller.admin || seller.admin.id !== adminId) {
      throw new UnauthorizedException('You can only update your own sellers');
    }

    if (updateSellerdto.email && updateSellerdto.email !== seller.email) {
      const exists = await this.sellerRepository.findOne({ where: { email: updateSellerdto.email } });
      if (exists) throw new ConflictException('Email already exists');
    }

    if (updateSellerdto.password) {
      updateSellerdto.password = await bcrypt.hash(updateSellerdto.password, this.salt);
    }

    Object.assign(seller, updateSellerdto);
    return this.sellerRepository.save(seller);
  }

  
  async updateOwnSeller(selfId: number, dto: UpdateSellerDto): Promise<Seller> {
    const seller = await this.getSellerById(selfId);

    if (dto.email && dto.email !== seller.email) {
      const exists = await this.sellerRepository.findOne({ where: { email: dto.email } });
      if (exists) throw new ConflictException('Email already exists');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, this.salt);
    }

    Object.assign(seller, dto);
    return this.sellerRepository.save(seller);
  }

  async deleteSeller(id: number, adminId: number): Promise<void> {
    const seller = await this.sellerRepository.findOne({ 
      where: { id }, 
      relations: ['admin'] 
    });
  
    if (!seller) throw new NotFoundException('Seller not found');
  
    if (!seller.admin || seller.admin.id !== adminId) {
      throw new UnauthorizedException(
        'You can only delete sellers created by you'
      );
  }

  await this.sellerRepository.delete(id);
}

  async getSellersByAdmin(adminId: number): Promise<Seller[]> {
    return this.sellerRepository.find({
      where: { admin: { id: adminId } },
      relations: ['admin'],
    });
  }

  async getActiveSellers(): Promise<Seller[]> {
    return this.sellerRepository.find({ where: { status: 'active' }, relations: ['admin'] });
  }

  async findByEmail(email: string): Promise<Pick<Seller, 'id' | 'email' | 'password'> | null> {
    const seller = await this.sellerRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    
    console.log('Found seller by email:', { id: seller?.id, email: seller?.email });
    return seller;
  }

  async searchSeller(q: string) {
  return this.sellerRepository
    .createQueryBuilder('seller')
    .where('seller.id = :id', { id: Number(q) }) 
    .orWhere('seller.name ILIKE :name', { name: `%${q}%` })
    .getMany();
}
async getInactiveSellers(): Promise<Seller[]> {
  return this.sellerRepository.find({ 
    where: { status: 'inactive' },
    relations: ['admin'] 
  });
}


}
