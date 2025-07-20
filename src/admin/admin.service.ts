import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService{
    getAdmin():string{
        return "This is admin";
    }
    getAdminWithId(id:number):number{
        return id;
    }
}