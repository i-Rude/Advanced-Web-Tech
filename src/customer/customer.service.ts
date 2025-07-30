import { Injectable, NotFoundException } from "@nestjs/common";
import { AddCustomerDto } from "./add-customer.dto";
import { UpdateCustomerDto } from "./update-customer.dto";


@Injectable()
export class CustomerService{
    private customers  =[
        {
            id : 1,
            name : "Rudro",
            email : "rudro@aiub.edu",
            password : "D23456",
            gender : "male",
            phone : "01732221148",
            fileName : "rudro.jpg",
        },
    ];

    private getNextId(): number {
    if (this.customers.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.customers.map(a => a.id));
    return maxId + 1;
    }

    findAll(){
        return this.customers;
    }

    getCustomerById(id:number){
        const customer = this.customers.find((a) => a.id === id);
        if(!customer) throw new NotFoundException("Customer not found");
        return customer;
    }

    getCustomer():string{
        return "This is customer";
    }
    
    createCustomer(addCustomerDto:AddCustomerDto){
        const newCustomer = {id: this.getNextId(), ...addCustomerDto};
        this.customers.push(newCustomer);
        return newCustomer;
        
    }

    updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto){
        const customerExist = this.customers.findIndex((a) => a.id === id)
        if(customerExist === -1) throw new NotFoundException("Customer Not Found");

        this.customers[customerExist] = { ...this.customers[customerExist], ...updateCustomerDto};
        return this.customers[customerExist];
    }
    
}