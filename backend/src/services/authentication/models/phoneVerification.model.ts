import * as mongoose from 'mongoose';
import { IsOptional } from 'class-validator';
import { prop } from '@typegoose/typegoose';
import * as uuid from 'node-uuid';

export const phoneVerificationSchemaOptions: mongoose.SchemaOptions = {
    collection: 'auth_phone_verification',
    timestamps: true,
    autoIndex: true,
};

export class PhoneVerification {
    @IsOptional()
    @prop({
        default: () => uuid.v4(),
        index: true,
    })
    auth_phone_verification_id: string;

    @IsOptional()
    @prop({
        type: String,
        index: true,
    })
    phone: string;
    @IsOptional()
    @prop({
        type: Date,
        index: true,
    })
    expires: Date;

    @IsOptional()
    @prop({
        type: Date,
        index: true,
    })
    nextTryTime: Date;
    @IsOptional()
    @prop({
        type: Date,
        index: true,
    })
    lastTryTime: Date;

    @IsOptional()
    @prop({
        index: true,
    })
    code: string;
    @IsOptional()
    @prop({
        index: true,
    })
    @IsOptional()
    @prop({
        index: true,
    })
    codeType: string;

    @IsOptional()
    @prop({
        type: Number,
        index: true,
    })
    codeLength: number;

    @IsOptional()
    @prop({
        type: Boolean,
        index: true,
        default: false,
    })
    ban: boolean;

    @IsOptional()
    @prop({
        type: Number,
        index: true,
        default: 0,
    })
    resendCountPerCode: number;
    @IsOptional()
    @prop({
        type: Number,
        index: true,
        default: 0,
    })
    resendCountTotal: number;

    @IsOptional()
    @prop({
        type: Number,
        index: true,
        default: 0,
    })
    failedCountCode: number;

    @IsOptional()
    @prop({
        type: Number,
        index: true,
        default: 0,
    })
    failedCountTotal: number;

}
