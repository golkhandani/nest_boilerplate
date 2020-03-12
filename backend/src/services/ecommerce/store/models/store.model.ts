import { prop, arrayProp, index } from '@typegoose/typegoose';
import { IsString, IsOptional } from 'class-validator';
import * as uuid from 'node-uuid';
import { SchemaOptions } from 'mongoose';
import { StoreKind } from '../enums/storeKind.enum';
import { Branch } from './branch.model';
import { Image } from '@shared/models/image.model';
import { serverConstants } from '@constants/index';
import { GalleryItem } from '@shared/models/gallery.model';

@index({ 'categories': 'text', 'subcategories': 'text', 'tags': 'text', 'branches.title': 'text' })
@index({ title: 'text', subtitle: 'text' })
export class Store {
    @IsOptional()
    @prop({
        default: () => uuid.v4(),
        unique: true,
        index: true,
    })
    store_id: string;
    @IsOptional()
    @prop({
        type: String,
        default: StoreKind.ONLINE,
        index: true,
    })
    kind: StoreKind;

    @IsOptional()
    @prop({
        type: Boolean,
        default: true,
        index: true,
    })
    isActive: boolean;

    @IsOptional()
    @prop({
        type: String,
        index: true,
    })
    title: string;
    @IsOptional()
    @prop({
        type: String,
        index: true,
    })
    subtitle: string;

    @arrayProp({
        items: Branch,
    })
    branches: Branch[];

    @arrayProp({
        items: String,
    })
    categories: string[];

    @arrayProp({
        items: String,
    })
    subcategories: string[];

    @arrayProp({
        items: String,
    })
    tags: string[];

    @prop({
        _id: false,
        type: GalleryItem,
    })
    logo: GalleryItem;
    @prop({
        _id: false,
        type: GalleryItem,
    })
    banner: GalleryItem;
    @arrayProp({
        _id: false,
        items: GalleryItem,
    })
    vitrins: GalleryItem[];

}

export const storeSchemaOptions: SchemaOptions = {
    timestamps: true,
    collection: 'e_commerce_store',
    toJSON: {
        transform(v) {

            // FIXME: IT HAS A MAGNIGICANT PERFORMANCE ISSUE ABOUT 0.5 ms
            // FIND A BETTER WAY
            const obj: Store = v._doc;
            /** to return images based on domain */
            if (obj?.logo?.suffix && !(obj?.logo?.suffix as string).startsWith('http')) {
                obj.logo.prefix = serverConstants.imagePrefix + '/';
            }
            if (obj?.banner?.suffix && !(obj?.banner?.suffix as string).startsWith('http')) {
                obj.banner.prefix = serverConstants.imagePrefix + '/';
            }
            obj.vitrins = obj.vitrins.filter(vitrin => vitrin?.prefix !== '' && vitrin?.suffix !== '');
            obj.vitrins.map(vitrin => {
                if (vitrin?.suffix && !(vitrin?.suffix as string).startsWith('http')) {
                    vitrin.prefix = serverConstants.imagePrefix + '/';
                }
            });

            return obj;
        },
    },
};
