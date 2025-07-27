import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Search, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AddAdminDto } from "./add-admin.dto";
import { UpdateAdminDto } from "./update-admin.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import { MulterError, diskStorage } from "multer";



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
    createAdmin(@Body() addAdminDto:AddAdminDto):object{
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
    )
    {
        return this.adminService.updateAdmin(id,updateAdminDto);

    }

    @Post('file')
    @UseInterceptors(
        FileInterceptor('myfile',
            {
                fileFilter:(req,file,cb) => {
                    if(file.originalname.match(/\.(jpg|jpeg|png|wepb)$/)){
                        cb(null , true)
                        console.log(file.buffer);
                    }
                    else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }

                },
                limits:{fileSize:2*1024*1024},
                storage:diskStorage({
                    destination:'./upload',
                    filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
                })
            }
        ))
    addAdmin(
    @Body() addAdminDto: AddAdminDto,
    @UploadedFile() file: Express.Multer.File,
)   {
        addAdminDto.fileName = file.filename;
        const createdAdmin = this.adminService.createAdmin(addAdminDto);
        return createdAdmin; 
    }
        
    

}


    

