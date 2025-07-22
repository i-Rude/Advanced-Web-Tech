import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Search } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AddAdminDto } from "./add-admin.dto";
import { UpdateAdminDto } from "./update-admin.dto";


@Controller('admin')
export class AdminController{
    constructor(private readonly adminService:AdminService){}
    // @Get()
    // getA():string{
    //     return "Admin";
    // }
    @Get('first')
    getAdmin():string{
        return this.adminService.getAdmin();
    }
    @Get(':id')
    getAdminById(@Param('id', ParseIntPipe) id : number){
        return this.adminService.getAdminById(id);
    }

    @Post()
    createAdmin(@Body() addAdminDto:AddAdminDto){
       return this.adminService.createAdmin(addAdminDto); 
    }
    @Get()
    getAllAdmins(){
    return this.adminService.findAll();
    }
    @Put(':id')
    updateAdmin(
        @Param('id',ParseIntPipe) id: number,
        @Body()updateAdminDto:UpdateAdminDto,
    ){
        return this.adminService.updateAdmin(id,updateAdminDto);

    }
    

    }


    
    
