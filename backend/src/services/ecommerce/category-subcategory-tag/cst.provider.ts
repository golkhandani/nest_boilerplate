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

    async findOrCreate(cstObj: CategorySubcategoryTagInputDto, cstIcon?: IMulterFile): Promise<CategorySubcategoryTag> {
        const fn = await this.CategorySubcategoryTagModel
            .findOne({
                $or: [
                    { cst_id: cstObj.title },
                    { $text: { $search: cstObj.title } },
                ],
            });
        if (fn) {
            return fn;
        } else {
            const saved = await this.CategorySubcategoryTagModel
                .create(
                    Object.assign(cstObj, {
                        ...cstIcon && {
                            icon: {
                                mimetype: cstIcon?.mimetype,
                                suffix: cstIcon?.path,
                            },
                        },
                    }),
                );
            return saved;
        }
    }
    async findAll(kind: string, identifier: string): Promise<CategorySubcategoryTag[]> {
        console.log(kind, identifier);
        return await this.CategorySubcategoryTagModel
            .find({
                $and: [
                    { kind },
                    {
                        $or: [
                            { cst_id: identifier },
                            { $text: { $search: identifier } },
                        ],
                    },
                ],
            });
    }
}
