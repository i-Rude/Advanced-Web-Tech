import { Injectable, NotFoundException } from "@nestjs/common";
import { AddAdminDto } from "./add-admin.dto";
import { UpdateAdminDto } from "./update-admin.dto";




@Injectable()
export class AdminService{
    private admins  =[
        {
            id : 1,
            name : "Tanjil",
            email : "tanilm445@gmail.com",
        },
    ];

    private getNextId(): number {
    if (this.admins.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.admins.map(a => a.id));
    return maxId + 1;
  }

    findAll(){
        return this.admins;
    }

    getAdminById(id:number){
        const admin = this.admins.find((a) => a.id === id);
        if(!admin) throw new NotFoundException("Admin not found");
        return admin;
    }

    getAdmin():string{
        return "This is admin";
    }
    // getAdminWithId(id:number):number{
    //     return id;
    // }
    createAdmin(addAdminDto:AddAdminDto){
        const newAdmin = {id: this.getNextId(), ...addAdminDto};
        this.admins.push(newAdmin);
        return newAdmin;
        
    }

    updateAdmin(id: number, updateAdminDto: UpdateAdminDto){
        const adminExist = this.admins.findIndex((a) => a.id === id)
        if(adminExist === -1) throw new NotFoundException("Admin Not Found");

        this.admins[adminExist] = { ...this.admins[adminExist], ...updateAdminDto};
        return this.admins[adminExist];
    }
    
}