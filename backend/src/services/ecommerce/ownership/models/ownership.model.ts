
import { prop, arrayProp } from '@typegoose/typegoose';
import { IsString, IsOptional } from 'class-validator';
import * as uuid from 'node-uuid';
import { SchemaOptions } from 'mongoose';
import { OwnershipAccessLevel } from '../enums/ownershipLevel.enum';
export class Ownership {
    @IsOptional()
    @prop({
        default: () => uuid.v4(),
        index: true,
    })
    ownership_id: string;

    @IsOptional()
    @arrayProp({
        items: String,
        required: true,
        index: true,
    })
    access_levels: OwnershipAccessLevel[];

    @IsOptional()
    @prop({
        required: true,
        index: true,
    })
    user_id: string;

    @IsOptional()
    @prop({
        required: false,
        index: true,
        default: null,
    })
    store_id: string;
}
export const ownershipSchemaOptions: SchemaOptions = {
    timestamps: true,
    collection: 'e_commerce_ownership',
};
