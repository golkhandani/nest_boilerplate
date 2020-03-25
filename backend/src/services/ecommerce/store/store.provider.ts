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
import { categorySubcategoryTagSchemaOptions, cstLookup } from '../category-subcategory-tag/models/cst.model';

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
        console.log('storeInputDto', storeInputDto);
        const categories = await Promise.all(
            storeInputDto.categories.map(async (category) => {
                const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.CATEGORY, title: category.title });
                return c.cst_id;
            }),
        );
        const subcategories = await Promise.all(
            storeInputDto.subcategories.map(async (subcategory) => {
                const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.SUBCATEGORY, title: subcategory.title });
                return c.cst_id;
            }),
        );
        const tags = await Promise.all(
            storeInputDto.tags.map(async (tag) => {
                const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.SUBCATEGORY, title: tag.title });
                return c.cst_id;
            }),
        );
        const newStore = new Store();
        newStore.kind = storeInputDto.kind;
        newStore.title = storeInputDto.title;
        newStore.subtitle = storeInputDto.subtitle;
        newStore.branches = storeInputDto.branches;
        newStore.categories = categories;
        newStore.subcategories = subcategories;
        newStore.tags = tags;

        console.log('storeInputDto1', storeInputDto);
        // storeInputDto.categories = categories;
        // storeInputDto.subcategories = subcategories;
        // storeInputDto.tags = tags;

        const store = await this.StoreModel.create(
            newStore,
        );
        console.log('storeInputDto2', storeInputDto);
        const newOwnership = {
            user_id,
            access_levels: [OwnershipAccessLevel.OWNER],
            store_id: store.store_id,
        };
        const ownership = await this.ownerProvider.create(newOwnership);
        const savedStore = Object.assign(store,
            { categories: storeInputDto.categories },
            { subcategories: storeInputDto.subcategories },
            { tags: storeInputDto.tags },
        );
        console.log('savedStore', savedStore);
        return {
            ownership,
            store: Object.assign(store.toObject(),
                { categories: storeInputDto.categories },
                { subcategories: storeInputDto.subcategories },
                { tags: storeInputDto.tags },
            ),
        };
    }

    async addMediaToStore(store_id: string, logo?: IMulterFile, banner?: IMulterFile, vitrins?: IMulterFile[]) {
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
        const [fn] = await this.StoreModel.aggregate([
            { $match: { store_id } },
            {
                $lookup: cstLookup.category,
            },
            {
                $lookup: cstLookup.subctegory,
            },
            {
                $lookup: cstLookup.tag,
            },
        ]);

        // const categories = await Promise.all(
        //     fn.categories.map(async (category) => {
        //         const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.CATEGORY, cst_id: category });
        //         return c.cst_id;
        //     }),
        // );
        // const subcategories = await Promise.all(
        //     fn.subcategories.map(async (subcategory) => {
        //         const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.SUBCATEGORY, cst_id: subcategory });
        //         return c.cst_id;
        //     }),
        // );
        // const tags = await Promise.all(
        //     fn.tags.map(async (tag) => {
        //         const c = await this.categorySubcategoryTagProvider.findOrCreate({ kind: CstKind.SUBCATEGORY, cst_id: tag });
        //         return c.cst_id;
        //     }),
        // );
        // const store = Object.assign(fn.toObject(),
        //     { categories },
        //     { subcategories },
        //     { tags },
        // );
        // console.log(store);
        // return store;
        return fn;
    }

}
