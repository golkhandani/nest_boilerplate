import { Controller, Get, Post, Body, UseGuards, Res, Req, Put, UseInterceptors, UploadedFiles, Param } from '@nestjs/common';
import { StoreProvider } from './store.provider';
import { UserGuard } from '@shared/guards';
import { UserFromHeader } from '@shared/decorators';
import { OwnershipGuard, AccessLevels } from '../ownership/ownership.guard';
import { OwnershipAccessLevel } from '../ownership/enums/ownershipLevel.enum';
import { Image } from '@shared/models';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller(StoreController.path)
export class StoreController {
    public static path: string = 'stores';
    constructor(
        private readonly storeProvider: StoreProvider,
    ) { }

    @UseGuards(OwnershipGuard)
    @Post('')
    async createNewStore(
        @UserFromHeader() user,
        @Body() store,
    ) {
        return await this.storeProvider.createNewStore(store, user.user_id);
    }

    @AccessLevels(OwnershipAccessLevel.AGENT, OwnershipAccessLevel.OWNER)
    @UseGuards(OwnershipGuard)
    @Put(':store_id/pictures')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'logo', maxCount: 1 },
            { name: 'banner', maxCount: 1 },
            { name: 'vitrins', maxCount: 3 },
        ]))
    addPictureToStore(
        @Param('store_id') store_id,
        @UploadedFiles() files: { logo, banner, vitrins },
    ) {
        return this.storeProvider.addPictureToStore(store_id, files.logo[0], files.banner[0], files.vitrins);
    }
    @AccessLevels(OwnershipAccessLevel.AGENT, OwnershipAccessLevel.OWNER)
    @UseGuards(OwnershipGuard)
    @Get(':store_id')
    async getStore(
        @Param('store_id') store_id,
    ) {
        return await this.storeProvider.getStoreById(store_id);
    }

    @UseGuards(OwnershipGuard)
    @Get('')
    getOwenership(@Req() req) {
        return req.user;
    }

}
