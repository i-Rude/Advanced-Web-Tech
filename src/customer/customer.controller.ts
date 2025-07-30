import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Search, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { AddCustomerDto } from "./add-customer.dto";
import { UpdateCustomerDto } from "./update-customer.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import { MulterError, diskStorage } from "multer";



@Controller('customer')
export class CustomerController{
    constructor(private readonly customerService:CustomerService){}
    
    @Get('first')
    getCustomer():string{
        return this.customerService.getCustomer();
    }

    @Get(':id')
    getCustomerById(@Param('id', ParseIntPipe) id : number){
        return this.customerService.getCustomerById(id);
    }

    @Post()
    createCustomer(@Body() addCustomerDto:AddCustomerDto):object{
       return this.customerService.createCustomer(addCustomerDto); 
    }

    @Get()
    getAllCustomers(){
    return this.customerService.findAll();
    }

    @Put(':id')
    updateCustomer(
        @Param('id',ParseIntPipe) id: number,
        @Body()updateCustomerDto:UpdateCustomerDto,
    )
    {
        return this.customerService.updateCustomer(id,updateCustomerDto);

    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file',
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
    addCustomer(
    @Body() addCustomerDto: AddCustomerDto,
    @UploadedFile() file: Express.Multer.File,
    )   
    {
        addCustomerDto.fileName = file.filename;
        const createdCustomer = this.customerService.createCustomer(addCustomerDto);
        return createdCustomer; 
    }
        

}


    

