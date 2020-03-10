import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Ownership, ownershipSchemaOptions } from './models/ownership.model';
import { OwnershipProvider } from './ownership.provider';
import { OwnershipController } from './ownership.controller';

@Module({
    imports: [
        TypegooseModule.forFeature([{
            typegooseClass: Ownership,
            schemaOptions: ownershipSchemaOptions,
        }])],
    providers: [OwnershipProvider],
    controllers: [OwnershipController],
    exports: [OwnershipProvider],
})
export class OwnershipModule { }
