import { StoreKind } from '../enums/storeKind.enum';

import { Branch } from '../models/branch.model';
import { Image, GalleryItem } from '@shared/models';

export class StoreInputDto {

    kind: StoreKind;

    title: string;

    subtitle: string;
    branches: Branch[];

    categories: string[];

    subcategories: string[];

    tags: string[];

}
