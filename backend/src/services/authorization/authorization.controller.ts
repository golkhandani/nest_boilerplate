import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { AuthorizationProvider } from '@services/authorization/authorization.provider';
import { UserScopes } from '@services/authorization/models';

@Controller(AuthorizationController.path)
@ApiTags(AuthorizationController.path)
export class AuthorizationController {
    public static path: string = 'authorization/scopes';
    constructor(
        private readonly authorizationProvider: AuthorizationProvider) {
    }
    @Post()
    async addScopes(
        @Body('scopes') scopes: UserScopes[],
        @Query('user') userId: string,
    ) {
        return this.authorizationProvider.addScopes(userId, scopes);
    }
    @Get()
    async getScopes(
        @Query('user') userId: string,
    ) {
        return this.authorizationProvider.getScopes(userId);
    }
    @Delete()
    async removeScopes(
        @Body('scopes') scopes: UserScopes[],
        @Query('user') userId: string,
    ) {
        return this.authorizationProvider.removeScopes(userId, scopes);
    }
}
