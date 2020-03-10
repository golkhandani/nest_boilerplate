import { Controller, Get, Post, Body, UseGuards, Res, Req } from '@nestjs/common';
import { StoreProvider } from './store.provider';
import { UserGuard } from '@shared/guards';
import { UserFromHeader } from '@shared/decorators';
import { OwnershipGuard, AccessLevels } from '../ownership/ownership.guard';
import { OwnershipAccessLevel } from '../ownership/enums/ownershipLevel.enum';

@Controller(StoreController.path)
export class StoreController {
    public static path: string = 'stores';
    constructor(
        private readonly storeProvider: StoreProvider,
    ) { }

    @UseGuards(UserGuard)
    @Post('')
    async createNewStore(
        @UserFromHeader() user,
        @Body() store,
    ) {
        return await this.storeProvider.createNewStore(store, user.user_id);
    }
    @UseGuards(OwnershipGuard)
    @Get('')
    getOwenership(@Req() req) {
        return req.user;
    }

    @AccessLevels(OwnershipAccessLevel.AGENT, OwnershipAccessLevel.OWNER)
    @UseGuards(OwnershipGuard)
    @Get(':store_id')
    getStore(@Req() req) {
        return [req.user, req.params.store_id];
    }

}
