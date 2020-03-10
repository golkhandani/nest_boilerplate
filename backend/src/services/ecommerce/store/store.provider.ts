import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Store } from './models/store.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { OwnershipProvider } from '../ownership/ownership.provider';
import { OwnershipAccessLevel } from '../ownership/enums/ownershipLevel.enum';

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
    async createNewStore(storeInputDto: any, user_id: string) {
        const store = await this.StoreModel.create({});
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

}
