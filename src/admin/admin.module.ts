import {Module} from '@nestjs/common'
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AuthService } from 'src/auth/auth.service';


@Module({
     imports: [TypeOrmModule.forFeature([Admin])],
     
    controllers:[AdminController],
    providers:[AdminService , AuthService],
    exports: [AdminService],
})
export class AdminModule{}