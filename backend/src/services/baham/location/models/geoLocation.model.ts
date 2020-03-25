import { prop } from '@typegoose/typegoose';

export class GeoLocation {
    @prop({
        default: 'Point',
        index: true,
    })
    type: string = 'Point';
    @prop({
        index: true,
    })
    coordinates: number[];
}
// IMPORTANT: coordinate: [ long , lat]
