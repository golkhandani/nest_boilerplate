
import { prop, arrayProp, index } from '@typegoose/typegoose';
import { IsString, IsOptional } from 'class-validator';
import * as uuid from 'node-uuid';
import { SchemaOptions } from 'mongoose';
import { OwnershipAccessLevel } from '../enums/ownershipLevel.enum';

@index({ user_id: 1, store_id: 1 }, { unique: true })
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
