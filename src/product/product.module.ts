import { Get, Module, Param, ParseIntPipe } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
    controllers:[ProductController],
    providers:[ProductService,]
})
export class ProductModule{

}