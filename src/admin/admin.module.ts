import {Module} from '@nestjs/common'
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AuthService } from 'src/auth/auth.service';
import { SellerModule } from 'src/seller/seller.module';


@Module({
     imports: [TypeOrmModule.forFeature([Admin]),
        SellerModule
    ],
     
    controllers:[AdminController],
    providers:[AdminService ],
    exports: [AdminService],
})
export class AdminModule{}