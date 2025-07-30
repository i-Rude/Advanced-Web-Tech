import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AddAdminDto } from "./add-admin.dto";
import { UpdateAdminDto } from "./update-admin.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Express } from "express";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    async getAllAdmins(){
    return await this.adminService.findAll();
    }

    @Get(":id")
    async getAdminById(@Param("id", ParseIntPipe) id: number) {
        return await this.adminService.getAdminById(id);
    }

    @Post()
    async createAdmin(@Body() addAdminDto: AddAdminDto) {
        return await this.adminService.createAdmin(addAdminDto);
    }

    @Put(":id")
    async updateAdmin(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAdminDto: UpdateAdminDto
    ) {
        return await this.adminService.updateAdmin(id, updateAdminDto);
    }

    @Patch(':id/status')
    async changeStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: 'active' | 'inactive') {
    return await this.adminService.changeStatus(id, status);
    }

    @Get('upper/:age')
    async olderThan(@Param('age', ParseIntPipe) age: number) {
    return await this.adminService.getOlderThan(age);
    }

    @Post('file')
    @UseInterceptors(
    FileInterceptor('myfile', {
    storage: diskStorage({
      destination: './upload',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
        cb(null, true);
      } else {
        cb(new Error('Wrong Format'), false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  }),
)
async addAdmin(
  @Body() addAdminDto: AddAdminDto,
  @UploadedFile() file: Express.Multer.File,
    ) {
        console.log(file);
  if (file) {
    addAdminDto.fileName = file.filename; 
  }
  return await this.adminService.createAdmin(addAdminDto);
}

}
