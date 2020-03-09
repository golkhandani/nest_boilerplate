import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersProfileModule } from '@services/profiles/profiles.modules';
import { ResellerModule } from '../../businesses/reseller.module';

@Module({
  imports: [
    UsersProfileModule,
    ResellerModule,
  ],
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminModule { }
