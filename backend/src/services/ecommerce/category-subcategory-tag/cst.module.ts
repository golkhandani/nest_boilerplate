import { Module } from '@nestjs/common';
import { CategorySubcategoryTagController } from './cst.controller';
import * as multer from 'multer';
import * as uuid from 'node-uuid';
import * as redisStore from 'cache-manager-redis-store';
import { fsMakeDirIfNotExists } from '@shared/helpers';
import { MulterModuleOptions, MulterModule } from '@nestjs/platform-express';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategorySubcategoryTag, categorySubcategoryTagSchemaOptions } from './models/cst.model';
import { CategorySubcategoryTagProvider } from './cst.provider';

export const tempfolder: string = `./statics/category-subcategory-tag/pictures`;
export const multerStorageMaker = (folder: string) => {
    return multer.diskStorage({
        destination: async (req, file, cb) => {
            const path = folder + `/${req.params.store_id}`;
            await fsMakeDirIfNotExists(path);
            cb(null, path);
        },
        filename: (req, file, cb) => {
            cb(null, uuid.v4() + '__' + file.originalname);
        },
    });
};
export const storage = multerStorageMaker(tempfolder);
export const multerOptions: MulterModuleOptions = {
    storage,
};

@Module({
    imports: [
        MulterModule.register(multerOptions),
        TypegooseModule.forFeature([{
            typegooseClass: CategorySubcategoryTag,
            schemaOptions: categorySubcategoryTagSchemaOptions,
        }]),
    ],
    controllers: [CategorySubcategoryTagController],
    providers: [CategorySubcategoryTagProvider],
    exports: [CategorySubcategoryTagProvider],
})
export class CategorySubcategoryTagModule { }
