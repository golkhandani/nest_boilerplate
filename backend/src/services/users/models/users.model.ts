import { prop, arrayProp } from '@typegoose/typegoose';
import { IsString, IsOptional } from 'class-validator';
import * as uuid from 'node-uuid';
import { SchemaOptions } from 'mongoose';
import { serverConstants } from '@constants/index';

export enum UserRoles {
    GUEST = 'GUEST',
    USER = 'USER',
    SELLER = 'SELLER',
    ADMIN = 'ADMIN',
    GOD = 'GOD',
}
export class User {
    @IsOptional()
    @prop({
        default: () => uuid.v4(),
        index: true,
    })
    user_id: string;

    //#region Login
    @IsOptional()
    @prop({
        index: true,
    })
    fingerprint: string;
    @IsOptional()
    @prop({
        index: true,
    })
    username: string;
    @IsOptional()
    @prop({
        index: true,
    })
    email: string;
    @IsOptional()
    @prop({
        type: String,
    })
    password: string;
    @IsOptional()
    @prop({
        index: true,
    })
    google: string;
    @IsOptional()
    @prop({
        index: true,
    })
    phone: string;
    @IsOptional()
    @prop({
        type: Boolean,
        index: true,
    })
    verified: boolean;
    //#endregion

    //#region Profile
    @prop({
        type: String,
        index: true,
    })
    firstName: string;
    @prop({
        type: String,
        index: true,
    })
    lastName: string;

    @IsOptional()
    @prop({
        type: String,
        index: true,
    })
    name: string;
    @IsOptional()
    @prop({
        prefix: { type: String, default: '' },
        suffix: { type: String },
        index: true,
    })
    picture: {
        prefix?: string,
        suffix: string,
    };
    @IsOptional()
    @prop({
        type: String,
        index: true,
    })
    address: string;
    //#endregion

    //#region Authentication
    @IsOptional()
    @prop({
        type: String,
        default: UserRoles.USER,
        index: true,
    })
    role: UserRoles;
    //#endregion
}
export const UserModelName = 'user';

export const userSchemaOptions: SchemaOptions = {
    collection: UserModelName,
    timestamps: true,
    autoIndex: true,
    id: true,
    _id: true,
    toJSON: {
        transform(v) {
            const obj: User = v._doc;
            /** for safety reasons */
            delete obj.password;
            delete obj.phone;
            delete obj.fingerprint;
            /** to return images based on domain */
            if (obj?.picture?.suffix && !(obj?.picture?.suffix as string).startsWith('http')) {
                obj.picture.prefix = serverConstants.imagePrefix + '/';
            }
            return obj;
        },
    },
};
