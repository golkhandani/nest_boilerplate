import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import * as multer from 'multer';
import * as uuid from 'node-uuid';

import { Store, storeSchemaOptions } from './models/store.model';
import { StoreProvider } from './store.provider';

import { OwnershipModule } from '../ownership/ownership.module';
import { MulterModuleOptions, MulterModule } from '@nestjs/platform-express';
import { fsMakeDirIfNotExists } from '@shared/helpers';

export const tempfolder: string = `./statics/store/pictures`;

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
        OwnershipModule,
        MulterModule.register(multerOptions),
        TypegooseModule.forFeature([{
            typegooseClass: Store,
            schemaOptions: storeSchemaOptions,
        }])],
    controllers: [StoreController],
    providers: [StoreProvider],
})
export class StoreModule { }