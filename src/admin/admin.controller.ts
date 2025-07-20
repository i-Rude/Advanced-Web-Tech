import { Controller, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController{
    constructor(private readonly adminService:AdminService){}
    @Get()
    getA():string{
        return "Admin";
    }
    @Get('first')
    getAdmin():string{
        return this.adminService.getAdmin();
    }
    @Get(':id')
    getAdminWithId(@Param('id') id : number):number{
        return this.adminService.getAdminWithId(id);

    }
    
    
}