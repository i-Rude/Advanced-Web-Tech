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
    BadRequestException,
  } from "@nestjs/common";
  import { SellerService } from "./seller.service";
  import { AddSellerDto } from "./add-seller.dto";
  import { UpdateSellerDto } from "./update-seller.dto";
  import { FileInterceptor } from "@nestjs/platform-express";
  import { diskStorage } from "multer";
  import { Express } from "express";
  import { extname } from "path";
  
  @Controller("seller")
  export class SellerController {
    constructor(private readonly sellerService: SellerService) {}
  
    @Get("first")
    getSeller(): string {
      return this.sellerService.getSeller();
    }
  
    @Get(":id")
    getSellerById(@Param("id", ParseIntPipe) id: number) {
      return this.sellerService.getSellerById(id);
    }
  
    @Post()
    createSeller(@Body() addSellerDto: AddSellerDto): object {
      return this.sellerService.createSeller(addSellerDto);
    }
  
    @Get()
    getAllSellers() {
      return this.sellerService.findAll();
    }
  
    @Put(":id")
    updateSeller(
      @Param("id", ParseIntPipe) id: number,
      @Body() updateSellerDto: UpdateSellerDto
    ) {
      return this.sellerService.updateSeller(id, updateSellerDto);
    }
  
    @Post("file")
    @UseInterceptors(
      FileInterceptor("myfile", {
        storage: diskStorage({
          destination: "./upload",
          filename: (req, file, cb) => {
            const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
          },
        }),
        limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
        fileFilter: (req, file, cb) => {
          const allowedExtension = /\.pdf$/i;
          if (!allowedExtension.test(file.originalname)) {
            return cb(new BadRequestException("Only PDF files are allowed"), false);
          }
          cb(null, true);
        },
      })
    )
    addSeller(
      @UploadedFile() file: Express.Multer.File,
      @Body() addSellerDto: AddSellerDto
    ) {
      if (!file) {
        throw new BadRequestException("File is required and must be in PDF format");
      }
  
      addSellerDto.fileName = file.filename;
      return this.sellerService.createSeller(addSellerDto);
    }
  }
  