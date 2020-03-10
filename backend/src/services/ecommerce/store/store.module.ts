import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Store, storeSchemaOptions } from './models/store.model';
import { StoreProvider } from './store.provider';
import { OwnershipModule } from '../ownership/ownership.module';

@Module({
    imports: [
        OwnershipModule,
        TypegooseModule.forFeature([{
            typegooseClass: Store,
            schemaOptions: storeSchemaOptions,
        }])],
    controllers: [StoreController],
    providers: [StoreProvider],
})
export class StoreModule { }
