import * as multer from 'multer';
import { fsMakeDirIfNotExists } from './fs.helper';
import { MulterModuleOptions } from '@nestjs/platform-express';
import * as uuid from 'node-uuid';

export const multerStorageMaker = (folder: string) => {
    return multer.diskStorage({
        destination: async (req, file, cb) => {
            await fsMakeDirIfNotExists(folder);
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            cb(null, uuid.v4() + '__' + file.originalname);
        },
    });
};

