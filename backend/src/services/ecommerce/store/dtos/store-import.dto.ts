import { StoreKind } from '../enums/storeKind.enum';

import { Branch } from '../models/branch.model';
import { Image, GalleryItem } from '@shared/models';
import { IsOptional } from 'class-validator';
import { CategorySubcategoryTag } from '@services/ecommerce/category-subcategory-tag/models/cst.model';

export class StoreInputDto {

    @IsOptional()
    kind: StoreKind;
    @IsOptional()
    title: string;
    @IsOptional()
    subtitle: string;
    @IsOptional()
    branches: Branch[];
    @IsOptional()
    categories: Array<Partial<CategorySubcategoryTag>>;
    @IsOptional()
    subcategories: Array<Partial<CategorySubcategoryTag>>;
    @IsOptional()
    tags: Array<Partial<CategorySubcategoryTag>>;

}
