import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Store } from './models/store.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { OwnershipProvider } from '../ownership/ownership.provider';
import { OwnershipAccessLevel } from '../ownership/enums/ownershipLevel.enum';
import { StoreInputDto } from './dtos/store-import.dto';
import { Image } from '@shared/models';
import { IMulterFile } from '@shared/interfaces';

@Injectable()
export class StoreProvider {
    constructor(
        @InjectModel(Store) private readonly StoreModel: ReturnModelType<typeof Store>,
        private readonly ownerProvider: OwnershipProvider,
    ) { }

    /**
     * sample :
     * {
     *  "user_id": "5e37d09fe4f3bf36b3a9a85a",
     *  "access_levels":["OWNER"],
     *  "shop_id":"bebbcc0e-72f5-4692-aab4-a3444139111c",
     * }
     */
    async createNewStore(storeInputDto: StoreInputDto, user_id: string) {
        const store = await this.StoreModel.create(storeInputDto);
        const newOwnership = {
            user_id,
            access_levels: [OwnershipAccessLevel.OWNER],
            store_id: store.store_id,
        };
        const ownership = await this.ownerProvider.create(newOwnership);
        return {
            ownership, store,
        };
    }

    async addPictureToStore(store_id: string, logo?: IMulterFile, banner?: IMulterFile, vitrins?: IMulterFile[]) {
        const update = {
            $set: {},
            $addToSet: {},
        };
        if (logo) {
            Object.assign(update.$set, {
                logo: {
                    suffix: logo.path,
                },
            });
        }
        if (banner) {
            Object.assign(update.$set, {
                banner: {
                    suffix: banner.path,
                },
            });
        }
        if (vitrins) {
            Object.assign(update.$addToSet, {
                vitrins: {
                    $each: vitrins.map(item => ({ suffix: item.path })),
                },
            });
        }
        const updatedStore =
            await this.StoreModel.findOneAndUpdate(
                { store_id },
                update,
                { new: true },
            );
        return updatedStore;

    }

    async getStoreById(store_id: string) {
        console.time('FIND');
        const fn = await this.StoreModel.findOne({ store_id });
        console.timeEnd('FIND');
        return fn;
    }

}
