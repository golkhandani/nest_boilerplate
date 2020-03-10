import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OwnershipProvider } from './ownership.provider';
import { Ownership } from './models/ownership.model';
import { ApiTags } from '@nestjs/swagger';

@Controller(OwnershipController.path)
@ApiTags(OwnershipController.path)
export class OwnershipController {
    public static path: string = 'owners';
    constructor(private readonly ownerProvider: OwnershipProvider) { }

    @Get('all')
    async getOwners(): Promise<Ownership[] | null> {
        return await this.ownerProvider.findAll();
    }

    @Get()
    async getSpecificShops(
        @Query('user_id') user_id: string,
        @Query('shop_id') shop_id: string,
    ): Promise<Ownership> {
        return await this.ownerProvider.getSpecificOwner(user_id, shop_id);
    }

    @Post()
    async create(@Body() owner: Ownership): Promise<Ownership> {
        return await this.ownerProvider.create(owner);
    }
}
