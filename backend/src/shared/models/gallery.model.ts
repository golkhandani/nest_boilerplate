import { prop } from '@typegoose/typegoose';
import { mimeTypes } from '@shared/helpers/mimeTypes.helper';
export class GalleryItem {
    @prop({
        type: String,
        default: mimeTypes['.jpeg'],
    })
    mimetype: mimeTypes;
    @prop({
        type: String,
    })
    suffix: string;
    @prop({
        type: String,
    })
    prefix: string;
}
