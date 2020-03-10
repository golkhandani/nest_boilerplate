import { prop } from '@typegoose/typegoose';

export class Image {
    @prop({
        type: String,
    })
    prefix: string;
    @prop({
        type: String,
    })
    suffix: string;
}
