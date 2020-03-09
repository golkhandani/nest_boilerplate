import { Module } from '@nestjs/common';
import { ResellerController } from './reseller.controller';
import { ResellerService } from './reseller.provider';
import { resellerSchemaOptions, Reseller } from './models/reseller.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forFeature([{
      typegooseClass: Reseller,
      schemaOptions: resellerSchemaOptions,
    }]),
  ],
  controllers: [ResellerController],
  providers: [ResellerService],
  exports: [ResellerService],
})
export class ResellerModule { }
