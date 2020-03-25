import {
    Controller,
    Get, Post, Put, Delete,
    Request,
    Body, Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    CacheInterceptor,

} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { UserFromHeader, UserInHeader } from '@shared/decorators';
import { UserGuard as RoleGuard, Roles, Scopes } from '@shared/guards';
import { User, UserRoles } from '@shared/models';
import { IApi, IMulterFile } from '@shared/interfaces';

import { UsersProfileProvider } from '@services/profiles/profiles.provider';
import { UpdateUserDto } from '@services/profiles/dtos';

import { UserScopes } from '@services/authorization/models';

@Controller(UsersProfileController.path)
@ApiTags(UsersProfileController.path)
export class UsersProfileController {

    public static path = 'users';

    @Get('ping')
    @UseGuards(RoleGuard)
    @Roles(UserRoles.USER, UserRoles.GUEST)
    getPing(
        @Request() req,
        @UserFromHeader() user): any {
        return {
            authorization: req.headers.authorization,
            user,
        };
    }
    constructor(
        private readonly usersProfileProvider: UsersProfileProvider,
    ) { }

    @Roles(UserRoles.USER)
    @Scopes(UserScopes.ME)
    @UseGuards(RoleGuard)
    @Get('self')
    async getProfile(@UserFromHeader() user: UserInHeader): Promise<IApi<User>> {
        return {
            data: await this.usersProfileProvider.getProfile(user),
            message: 'user owner',
        };
    }

    @Scopes(UserScopes.ME)
    @Roles(UserRoles.USER)
    @UseGuards(RoleGuard)
    @Put('self')
    async updateProfile(
        @UserFromHeader() user: UserInHeader,
        @Body() updates: UpdateUserDto,
    ): Promise<IApi<User>> {
        return {
            data: await this.usersProfileProvider.updateProfile(user, updates),
            message: 'user owner',
        };
    }

    @Scopes(UserScopes.ME)
    @UseGuards(RoleGuard)
    @Put('self/picture')
    @UseInterceptors(FileInterceptor('file'))
    async updateProfilePicture(
        @UserFromHeader() user: UserInHeader,
        @UploadedFile() file: IMulterFile): Promise<IApi<User>> {
        return {
            data: await this.usersProfileProvider.updateProfilePicture(user, file),
            message: 'user picture updated',
        };
    }
    @Scopes(UserScopes.ME)
    @UseGuards(RoleGuard)
    @Delete('self/picture')
    async deleteProfilePicture(
        @UserFromHeader() user: UserInHeader): Promise<IApi<User>> {
        return {
            data: await this.usersProfileProvider.deleteProfilePicture(user),
            message: 'user picture updated',
        };
    }

    @Get('transactions')
    async testTransaction() {
        return await this.usersProfileProvider.transactionTest();
    }
}
