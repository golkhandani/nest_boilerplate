import { prop, arrayProp, pre, Typegoose, index } from '@typegoose/typegoose';
import { IsString, IsOptional } from 'class-validator';
import * as uuid from 'node-uuid';
import { SchemaOptions } from 'mongoose';
import { GeoLocation } from './geoLocation.model';
import { LocationOwnerType } from '../enums/LocationOwnerType.enum';
export const venueSchemaOptions: SchemaOptions = {
    collection: 'baham_locatons',
    timestamps: true,
    autoIndex: true,
};

@index({ geoLocation: '2dsphere' })
export class Location {
    @prop({
        type: String,
        enum: LocationOwnerType,
        index: true,
    })
    ownerType: LocationOwnerType;
    @prop({
        type: String,
        index: true,
    })
    owner_id: string;

    @prop({
        default: () => uuid.v4(),
        index: true,
    })
    location_id: string;

    @prop({
        type: GeoLocation,
    })
    geoLocation: GeoLocation;
}
