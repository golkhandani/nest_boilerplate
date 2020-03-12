import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CategorySubcategoryTag } from './models/cst.model';
import { IMulterFile } from '@shared/interfaces';
import { CategorySubcategoryTagInputDto } from './dtos/cst-input.dto';

@Injectable()
export class CategorySubcategoryTagProvider {
    constructor(
        @InjectModel(CategorySubcategoryTag) private readonly CategorySubcategoryTagModel: ReturnModelType<typeof CategorySubcategoryTag>,
    ) { }

    async createNew(cstObj: CategorySubcategoryTagInputDto, cstIcon: IMulterFile): Promise<CategorySubcategoryTag> {
        const saved = await this.CategorySubcategoryTagModel
            .create(
                Object.assign(cstObj, {
                    icon: {
                        mimetype: cstIcon.mimetype,
                        suffix: cstIcon,
                    },
                }),
            );
        return saved;
    }
    async getOne(identifier: string): Promise<CategorySubcategoryTag[]> {
        return await this.CategorySubcategoryTagModel
            .find({
                $or: [
                    { cst_id: identifier },
                    { $text: { $search: { $regex: `/*${identifier}*/` } } },
                ],
            });
    }
}
