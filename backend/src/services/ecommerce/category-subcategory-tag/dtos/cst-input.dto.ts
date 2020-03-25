import { CstKind } from '../enums/cst.enum';

export class CategorySubcategoryTagInputDto {

    kind: CstKind;
    title?: string;
    subtitle?: string;
    parent?: string;
    cst_id?: string;
}
