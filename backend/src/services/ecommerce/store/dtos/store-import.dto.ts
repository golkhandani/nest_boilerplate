import { StoreKind } from '../enums/storeKind.enum';

import { Branch } from '../models/branch.model';
import { Image } from '@shared/models';

export class StoreInputDto {

    kind: StoreKind;

    branches: Branch[];

    categories: string[];

    sucategories: string[];

    tags: string[];

    logo: Image;

    banner: Image;

    vitrins: Image[];
}
