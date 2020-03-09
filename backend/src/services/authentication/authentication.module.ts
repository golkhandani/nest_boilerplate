import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { jwtLockConstants } from '@constants/index';

import { AuthenticationController } from '@services/authentication/authentication.controller';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';

import {
    PhoneVerification,
    phoneVerificationSchemaOptions,
    RefreshToken,
    refreshTokenSchemaOptions,
} from '@services/authentication/models';
import {
    RefreshTokenRepository,
    PhoneVerificationRepository,
} from '@services/authentication/repositories';
import { UserAlreadyExist } from '@services/authentication/validators';

import { AuthorizationModule } from '@services/authorization/authorization.module';
import { NotificatonModule } from '@services/notification/notification.module';
import { UsersProfileModule } from '@services/profiles/profiles.modules';

@Module({
    imports: [
        NotificatonModule,
        AuthorizationModule,
        UsersProfileModule,
        PassportModule,
        JwtModule.register({
            secret: jwtLockConstants.private_key,
        }),
        TypegooseModule.forFeature([{
            typegooseClass: PhoneVerification,
            schemaOptions: phoneVerificationSchemaOptions,
        }]),
        TypegooseModule.forFeature([{
            typegooseClass: RefreshToken,
            schemaOptions: refreshTokenSchemaOptions,
        }]),
    ],
    providers: [
        AuthenticationProvider,
        PhoneVerificationRepository,
        RefreshTokenRepository,
        UserAlreadyExist,
    ],
    controllers: [
        AuthenticationController,
    ],
    exports: [
        AuthenticationProvider,
    ],
})
export class AuthenticationModule { }
