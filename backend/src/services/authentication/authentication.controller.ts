import {
    Body,
    Controller,
    Get,
    Headers,
    Post,
    Query,
} from '@nestjs/common';

import { ApiTags, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { UserWithTokenApi, VerificationCodeApi } from '@services/authentication/swaggers';
import { IApi } from '@shared/interfaces';

import {
    SignupByEmailDto,
    SignByPhoneCodeDto,
    SignByPhoneNumberDto,
    SignupByUsernameDto,
    UserWithTokenDto,
    VerificationCodeDto,
    SigninByUsernameDto,
    SigninByEmailDto,
    SingGuestUserDto,
    SignByGoogleDto,
    RefreshTokenDto,
} from '@services/authentication/dtos';

import { AuthenticationProvider } from '@services/authentication/authentication.provider';

@Controller(AuthenticationController.path)
@ApiTags(AuthenticationController.path)
export class AuthenticationController {

    public static path: string = 'authentication';
    constructor(
        private readonly authProvider: AuthenticationProvider) {
    }
    //#region Guest
    /**
     *
     * @param headers
     */
    @Post('signin/guest')
    @ApiHeader({ name: 'fingerprint', description: 'fingerprint or unique identifier for user' })
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'create new guest user' })
    async createGuestUser(@Headers() headers: SingGuestUserDto): Promise<IApi<UserWithTokenDto>> {
        return {
            data: await this.authProvider.signAsGuest(headers),
        };
    }
    //#endregion
    //#region USERNAME/PASSWORD

    @Post('signup/username')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'create new user' })
    async createUserByUsername(@Body() user: SignupByUsernameDto): Promise<IApi<UserWithTokenDto>> {
        return {
            data: await this.authProvider.signupByUserPass(user),
        };
    }
    @Post('signin/username')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'sign in user' })
    async loginByUsername(
        @Body() signinInfo: SigninByUsernameDto,
    ): Promise<IApi<UserWithTokenDto>> {
        const password = signinInfo.password;
        const username = signinInfo.username;
        return {
            data: await this.authProvider.signinByUserPass(username, password),
        };
    }
    //#endregion
    //#region EMAIL/PASSWORD
    @Post('signup/email')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'create new user' })
    async createUserByEmail(@Body() user: SignupByEmailDto): Promise<IApi<UserWithTokenDto>> {
        return {
            data: await this.authProvider.signupByEmailPass(user),
        };
    }
    @Post('signin/email')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'sign in user' })
    async loginByEmail(
        @Body() signinInfo: SigninByEmailDto,
    ): Promise<IApi<UserWithTokenDto>> {
        const email = signinInfo.email;
        const password = signinInfo.password;
        return {
            data: await this.authProvider.signinByEmailPass(email, password),
        };
    }
    @Post('verification/email')
    @ApiResponse({ status: 201, type: IApi, description: 'resend verification email' })
    async resendVeridicationByEmail(
        @Body() signinInfo: SigninByEmailDto,
    ): Promise<IApi<boolean>> {
        const email = signinInfo.email;
        const password = signinInfo.password;
        return {
            data: await this.authProvider.resendVerificationByEmail(email, password),
        };
    }
    @Get('verification/email')
    @ApiQuery({ name: 'token', description: 'token which contain email address', type: String })
    @ApiResponse({ status: 200, type: IApi, description: 'callback verification email' })
    async verifyByEmail(
        @Query('token') token: string): Promise<boolean> {
        return await this.authProvider.verifyByEmail(token);
    }
    //#endregion
    //#region PHONE/CODE
    @Post('signup/phone')
    @ApiResponse({ status: 201, type: VerificationCodeApi, description: 'sign user phone number' })
    async getPhoneSendCode(@Body() body: SignByPhoneNumberDto): Promise<IApi<VerificationCodeDto>> {
        return {
            data: await this.authProvider.signinByPhoneNumber(body.phone),
        };
    }
    @Post('signin/phone')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'sign user verfication code and create user if needed' })
    async get(
        @Body() body: SignByPhoneCodeDto): Promise<IApi<UserWithTokenDto>> {
        return {
            data: await this.authProvider.signinByPhoneCode(body.phone, body.code),
        };
    }
    //#endregion
    //#region GOOGLE
    @Post('signin/google')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'sign user with google account and create user if needed' })
    async createGoogleUser(
        @Body() signinInfo: SignByGoogleDto,
    ): Promise<IApi<UserWithTokenDto>> {
        const googleAccessToken = signinInfo.gat;
        const devicePlatform = signinInfo.dp;
        return {
            data: await this.authProvider.signinByGoogle(googleAccessToken, devicePlatform),
        };
    }
    //#endregion

    @Post('refresh')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'refresh user token' })
    async refresh(
        @Body() refreshInfo: RefreshTokenDto): Promise<IApi<UserWithTokenDto>> {
        const refreshToken = refreshInfo.refreshToken;
        return {
            data: await this.authProvider.refreshAccessToken(refreshToken),
        };
    }

}
