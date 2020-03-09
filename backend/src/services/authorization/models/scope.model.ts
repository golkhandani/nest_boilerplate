import * as mongoose from 'mongoose';
import { IsOptional } from 'class-validator';
import { prop } from '@typegoose/typegoose';
import * as uuid from 'node-uuid';

export const userScopeSchemaOptions: mongoose.SchemaOptions = {
    collection: 'auth_user_scope',
    timestamps: true,
    autoIndex: true,
};

export enum UserScopes {
    ME = 'ME',
    READ = 'READ',
    WRITE = 'WRITE',
    GOD = 'GOD',
}

export class UserScope {
    @IsOptional()
    @prop({
        default: () => uuid.v4(),
        index: true,
    })
    auth_user_scope_id: string;
    @IsOptional()
    @prop({
        index: true,
    })
    user_id: string;
    @IsOptional()
    @prop({
        index: true,
    })
    ME: boolean;
    @IsOptional()
    @prop({
        index: true,
    })
    READ: boolean;
    @IsOptional()
    @prop({
        index: true,
    })
    WRITE: boolean;
    @IsOptional()
    @prop({
        index: true,
    })
    GOD: boolean;
}
