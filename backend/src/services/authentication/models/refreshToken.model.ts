import * as mongoose from 'mongoose';
import { IsOptional } from 'class-validator';
import { prop } from '@typegoose/typegoose';
import * as uuid from 'node-uuid';

export const refreshTokenSchemaOptions: mongoose.SchemaOptions = {
    collection: 'auth_refresh_token',
    timestamps: true,
    autoIndex: true,
};

export class RefreshToken {
    @IsOptional()
    @prop({
        default: () => uuid.v4(),
        index: true,
    })
    auth_refresh_token_id: string;
    @IsOptional()
    @prop({
        index: true,
    })
    token: string;
    @IsOptional()
    @prop({
        index: true,
    })
    user_id: string;
    @IsOptional()
    @prop({
        type: Date,
        index: true,
    })
    expires: Date;
}
