import { Injectable, NotFoundException } from "@nestjs/common";
import { AddSellerDto } from "./add-seller.dto";
import { UpdateSellerDto } from "./update-seller.dto";




@Injectable()
export class SellerService{
    private sellers  =[
        {
            id : 1,
            name : "Tanjil",
            email : "tanilm445@gmail.com",
        },
    ];

    private getNextId(): number {
    if (this.sellers.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.sellers.map(a => a.id));
    return maxId + 1;
  }

    findAll(){
        return this.sellers;
    }

    getSellerById(id:number){
        const seller = this.sellers.find((a) => a.id === id);
        if(!seller) throw new NotFoundException("Seller not found");
        return seller;
    }

    getSeller():string{
        return "This is seller";
    }
    // getSellerWithId(id:number):number{
    //     return id;
    // }
    createSeller(addSellerDto:AddSellerDto){
        const newSeller = {id: this.getNextId(), ...addSellerDto};
        this.sellers.push(newSeller);
        return newSeller;
        
    }

    updateSeller(id: number, updateSellerDto: UpdateSellerDto){
        const sellerExist = this.sellers.findIndex((a) => a.id === id)
        if(sellerExist === -1) throw new NotFoundException("Seller Not Found");

        this.sellers[sellerExist] = { ...this.sellers[sellerExist], ...updateSellerDto};
        return this.sellers[sellerExist];
    }
    
} 