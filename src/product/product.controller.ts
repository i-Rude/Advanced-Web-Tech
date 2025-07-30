import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { AddProductDto } from "./add-product.dto";
import { UpdateProductDto } from "./update-product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Express } from "express";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) cb(null, true);
        else cb(new Error("Only image files are allowed"), false);
      },
      limits: { fileSize: 2 * 1024 * 1024 },
      storage: diskStorage({
        destination: "./upload",
        filename: (req, file, cb) => {
          cb(null, Date.now() + "_" + file.originalname);
        },
      }),
    })
  )
  addProduct(@Body() productDto: AddProductDto, @UploadedFile() file: Express.Multer.File) {
    if (file) productDto.fileName = file.filename;
    return this.productService.addProduct(productDto);
  }

  @Put(":id")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) cb(null, true);
        else cb(new Error("Only image files are allowed"), false);
      },
      limits: { fileSize: 2 * 1024 * 1024 },
      storage: diskStorage({
        destination: "./upload",
        filename: (req, file, cb) => {
          cb(null, Date.now() + "_" + file.originalname);
        },
      }),
    })
  )
  updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateData: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) updateData.fileName = file.filename;
    return this.productService.updateProduct(id, updateData);
  }

  @Delete(":id")
  deleteProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
