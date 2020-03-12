import { Controller, Get, Post, UseInterceptors, UploadedFile, Body, Query } from '@nestjs/common';
import { CategorySubcategoryTagProvider } from './cst.provider';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMulterFile } from '@shared/interfaces';
import { CategorySubcategoryTagInputDto } from './dtos/cst-input.dto';

@Controller('keywords')
export class CategorySubcategoryTagController {
    public static subpath = ['categories', 'subcategories', 'tags'];
    constructor(
        private readonly categorySubcategoryTagProvider: CategorySubcategoryTagProvider,
    ) { }

    @Post(CategorySubcategoryTagController.subpath)
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @Body() cstObj,
        @UploadedFile() file: IMulterFile,
    ) {
        return {
            data: {
                doc: await this.categorySubcategoryTagProvider.findOrCreate(cstObj, file),
            },
        };
    }

    @Get('')
    async find(
        @Query('kind') kind: 'category' | 'subcategory' | 'tag',
        @Query('identifier') identifier: string,
    ) {
        return {
            data: {
                docs: await this.categorySubcategoryTagProvider.findAll(kind.toUpperCase(), identifier),
            },
        };
    }
}
