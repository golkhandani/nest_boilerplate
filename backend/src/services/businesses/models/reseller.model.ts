import { prop, arrayProp, pre, Typegoose } from '@typegoose/typegoose';
import { IsString, IsOptional } from 'class-validator';
import * as uuid from 'node-uuid';
import { SchemaOptions } from 'mongoose';

export enum ResellerName {
  API = 'API',
}
export const resellerSchemaOptions: SchemaOptions = {
  collection: 'maram_reseller',
  timestamps: true,
  autoIndex: true,
};

export class Reseller {
  @IsOptional()
  @prop({
    default: () => uuid.v4(),
    index: true,
  })
  reseller_id: string;

  @IsOptional()
  @prop({
    uppercase: true,
    trim: true,
    unique: true,
    type: String,
    enum: ResellerName,
  })
  name: string;

  @IsOptional()
  @prop({
    unique: true,
    type: String,
    index: true,
  })
  public_key: string;
  @IsOptional()
  @prop({
    unique: true,
    type: String,
    index: true,
  })
  secret_key: string;
}
