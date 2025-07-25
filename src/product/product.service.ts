import { Injectable, NotFoundException } from "@nestjs/common";
import { AddProductDto } from "./add-product.dto";

@Injectable()
export class ProductService{
    private products = [
        {
            id : 1,
            name : "T-Shirt",
            description : "Full Sleve Solid T-Shirt",
            price : 400,
            stock : 20,
        },

    ];

    private getNextId(): number {
    if (this.products.length === 0) {
      return 1; 
    }
    const maxId = Math.max(...this.products.map(p => p.id));
    return maxId + 1;
  }

    
    findAll(){
        return this.products;
    }

    getProductById(id: number){
        const product = this.products.find((p) => p.id === id)
        if(!product){
            throw new NotFoundException("Product Found");
        }
        return product;
    }

    addProduct( addProductDto : AddProductDto){
        const newProduct = {id: this.getNextId(), ...addProductDto};
        this.products.push(newProduct);
        return newProduct;

    }

    
}