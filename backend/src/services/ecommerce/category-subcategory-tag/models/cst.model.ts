import { arrayProp, prop, index } from '@typegoose/typegoose';
import { IsOptional } from 'class-validator';
import * as uuid from 'node-uuid';
import { GalleryItem } from '@shared/models';
import { SchemaOptions } from 'mongoose';
import { serverConstants } from '@constants/index';

@index({ title: 'text', subtitle: 'text' })
export class CategorySubcategoryTag {
    @IsOptional()
    @prop({
        type: String,
        index: true,
        default: () => uuid.v4(),
    })
    cst_id: string;
    @IsOptional()
    @prop({
        required: true,
        type: String,
        index: true,
    })
    title: string;
    @IsOptional()
    @prop({
        type: String,
        index: true,
        default: null,
    })
    subtitle: string;
    @IsOptional()
    @prop({
        type: String,
        index: true,
        default: null,
    })
    parent: string;
    @prop({
        _id: false,
        type: GalleryItem,
        default: null,
    })
    icon: GalleryItem;
}

export const categorySubcategoryTagSchemaOptions: SchemaOptions = {
    timestamps: true,
    collection: 'e_commerce_category_subcategory_tag',
    toJSON: {
        transform(v) {

            // FIXME: IT HAS A MAGNIGICANT PERFORMANCE ISSUE ABOUT 0.5 ms
            // FIND A BETTER WAY
            const obj: CategorySubcategoryTag = v._doc;
            /** to return images based on domain */
            if (obj?.icon?.suffix && !(obj?.icon?.suffix as string).startsWith('http')) {
                obj.icon.prefix = serverConstants.imagePrefix + '/';
            }
            return obj;
        },
    },
};
