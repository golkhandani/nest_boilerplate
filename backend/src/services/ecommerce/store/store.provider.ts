import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Store } from './models/store.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { OwnershipProvider } from '../ownership/ownership.provider';
import { OwnershipAccessLevel } from '../ownership/enums/ownershipLevel.enum';
import { StoreInputDto } from './dtos/store-import.dto';
import { Image } from '@shared/models';
import { IMulterFile } from '@shared/interfaces';
import { CategorySubcategoryTagProvider } from '../category-subcategory-tag/cst.provider';
import { CstKind } from '../category-subcategory-tag/enums/cst.enum';

@Injectable()
export class StoreProvider {
    constructor(
        @InjectModel(Store) private readonly StoreModel: ReturnModelType<typeof Store>,
        private readonly ownerProvider: OwnershipProvider,
        private readonly categorySubcategoryTagProvider: CategorySubcategoryTagProvider,

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
        const cats = await Promise.all(
            storeInputDto.categories.map(async (category) => {
                const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.CATEGORY, title: category });
                return c.cst_id;
            }),
        );
        const subcats = await Promise.all(
            storeInputDto.subcategories.map(async (subcategory) => {
                const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.SUBCATEGORY, title: subcategory });
                return c.cst_id;
            }),
        );
        const tags = await Promise.all(
            storeInputDto.tags.map(async (tag) => {
                const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.SUBCATEGORY, title: tag });
                return c.cst_id;
            }),
        );

        storeInputDto.categories = cats;
        storeInputDto.subcategories = subcats;
        storeInputDto.tags = tags;

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

    async addMediaToStore(store_id: string, logo?: IMulterFile, banner?: IMulterFile, vitrins?: IMulterFile[]) {
        console.log(vitrins);
        const update = {
            $set: {},
            $addToSet: {},
        };
        if (logo) {
            Object.assign(update.$set, {
                logo: {
                    mimetype: logo.mimetype,
                    suffix: logo.path,
                },
            });
        }
        if (banner) {
            Object.assign(update.$set, {
                banner: {
                    mimetype: banner.mimetype,
                    suffix: banner.path,
                },
            });
        }
        if (vitrins) {
            Object.assign(update.$addToSet, {
                vitrins: {
                    $each: vitrins.map(item => ({
                        mimetype: item.mimetype,
                        suffix: item.path,
                    })),
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
