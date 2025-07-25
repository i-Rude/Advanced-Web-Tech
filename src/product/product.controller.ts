import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AddProductDto } from "./add-product.dto";

@Controller('product')
export class ProductController{

    constructor(private readonly productService:ProductService){}

    @Get()
    getAllProduct(){
        return this.productService.findAll();
    }
    @Get(':id')
    getProductById(
        @Param('id' , ParseIntPipe) id : number
    ){
        return this.productService.getProductById(id);
    }

    @Post()
    addProduct(@Body() addProductDto : AddProductDto){
        return this.productService.addProduct(addProductDto);
    }

}