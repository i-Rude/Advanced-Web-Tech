import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { AddSellerDto } from './add-seller.dto';
import { UpdateSellerDto } from './update-seller.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  async getAllSellers() {
    return await this.sellerService.findAll();
  }

  @Get(':id')
  async getSellerById(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.getSellerById(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '_' + file.originalname);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async createSeller(@Body() addSellerDto: AddSellerDto, @UploadedFile() file: Express.Multer.File) {
    if (file) addSellerDto.fileName = file.filename;
    return await this.sellerService.createSeller(addSellerDto);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '_' + file.originalname);
        },
      }),
    }),
  )
  async updateSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSellerDto: UpdateSellerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) updateSellerDto.fileName = file.filename;
    return await this.sellerService.updateSeller(id, updateSellerDto);
  }

  @Delete(':id')
  async deactivateSeller(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.deactivateSeller(id);
  }

  @Get('active/list')
  async getActiveSellers() {
    return await this.sellerService.getActiveSellers();
  }
}
