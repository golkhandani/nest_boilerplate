import { arrayProp, prop } from '@typegoose/typegoose';
import { IsOptional } from 'class-validator';

export class Branch {

    @prop({
        type: String,
        index: true,
    })
    title: string;
    @IsOptional()
    @arrayProp({
        items: String,
    })
    phones: string[];

    @IsOptional()
    @arrayProp({
        items: String,
    })
    addresses: string[];
}
