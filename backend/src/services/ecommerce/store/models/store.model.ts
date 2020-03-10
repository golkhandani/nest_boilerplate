import { prop, arrayProp } from '@typegoose/typegoose';
import { IsString, IsOptional } from 'class-validator';
import * as uuid from 'node-uuid';
import { SchemaOptions } from 'mongoose';

export class Store {
    @IsOptional()
    @prop({
        default: () => uuid.v4(),
        index: true,
    })
    store_id: string;
}

export const storeSchemaOptions: SchemaOptions = {
    timestamps: true,
    collection: 'e_commerce_store',
};
