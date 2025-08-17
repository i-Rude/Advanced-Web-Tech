import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Request,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AddAdminDto } from "./add-admin.dto";
import { UpdateAdminDto } from "./update-admin.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Express } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { AddSellerDto } from "src/seller/add-seller.dto";
import { SellerService } from "src/seller/seller.service";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService,
      private readonly sellerService : SellerService,
      
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    async getAllAdmins(){
    return await this.adminService.findAll();
    }

    @Get("byId/:id")
    @UseGuards(AuthGuard)
    async getAdminById(@Param("id", ParseIntPipe) id: number) {
        return await this.adminService.getAdminById(id);
    }

    // @Post()
    // async createAdmin(@Body() addAdminDto: AddAdminDto) {
    //     return await this.adminService.createAdmin(addAdminDto);
    // }

    @Patch(":id")
    @UseGuards(AuthGuard)
    async updateAdmin(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAdminDto: UpdateAdminDto
    ) {
        return await this.adminService.updateAdmin(id, updateAdminDto);
    }

    @Patch('updateStatus/:id')
    @UseGuards(AuthGuard)
    async changeStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: 'active' | 'inactive') {
    return await this.adminService.changeStatus(id, status);
    }

    @Get('upper/:age')
    async olderThan(@Param('age', ParseIntPipe) age: number) {
    return await this.adminService.getOlderThan(age);
    }
    @Get('inactive')
    async getInactiveAdmins(){
      return await this.adminService.getInactive();
    }

    @Delete(':id')
    async deleteAdmin(@Param('id', ParseIntPipe) id : number){
      await this.adminService.deleteAdmin(id);
      return { message: `Admin with id ${id} deleted successfully` };
    }

    @Post('createAdmin')
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
@Get('check')
@UseGuards(AuthGuard)
testProtected() {
  return {
    message: 'You are authenticated',
    
  };
}
@Post('seller')
@UseGuards(AuthGuard)
async createSeller(@Body() dto: AddSellerDto, @Request() req) {
  if (req.user.role !== 'admin') throw new UnauthorizedException();
  return this.sellerService.createSeller(dto, req.user.id);  
}

@Get('mySellers')
  @UseGuards(AuthGuard)
  async mySellers(@Request() req) {
    if (req.user.role !== 'admin') throw new UnauthorizedException();
    return this.adminService.getSellersByAdmin(req.user.sub);
  }
@Get('sellers/search')
@UseGuards(AuthGuard)
async searchAllSellers(@Query('q') query: string, @Request() req) {
  if (req.user.role !== 'admin') throw new UnauthorizedException();
  return this.sellerService.searchSeller(query ?? '');
}
@Get('sellers/inactive')
@UseGuards(AuthGuard)
async getInactiveSellers(@Request() req) {
  if (req.user.role !== 'admin') throw new UnauthorizedException();
  return this.sellerService.getInactiveSellers();
}
@Get('sellers/active')
@UseGuards(AuthGuard)
async getActiveSeller(@Request() req) {
  if (req.user.role !== 'admin') throw new UnauthorizedException();
  return this.sellerService.getActiveSellers();
}
  

}
