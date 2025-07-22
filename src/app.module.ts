import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
