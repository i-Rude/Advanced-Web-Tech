import { Injectable, NotFoundException } from "@nestjs/common";
import { AddProductDto } from "./add-product.dto";
import { UpdateProductDto } from "./update-product.dto";

@Injectable()
export class ProductService {
  private products: (AddProductDto & { id: number; discount: number })[] = [];

  private getNextId(): number {
    return this.products.length === 0 ? 1 : Math.max(...this.products.map(p => p.id)) + 1;
  }

  addProduct(productDto: AddProductDto) {
    const newProduct = { id: this.getNextId(), discount: 0, ...productDto };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, updateData: UpdateProductDto) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException("Product not found");

    this.products[index] = { ...this.products[index], ...updateData };
    return this.products[index];
  }

  deleteProduct(id: number) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException("Product not found");

    const deleted = this.products.splice(index, 1);
    return { message: "Product deleted successfully", deletedProduct: deleted[0] };
  }

  getAllProducts() {
    return this.products;
  }
}
