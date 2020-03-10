import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Ownership } from './models/ownership.model';

@Injectable()
export class OwnershipProvider {
    constructor(
        @InjectModel(Ownership) private readonly ownerModel: ReturnModelType<typeof Ownership>,
    ) { }

    async getOwner(user_id: string) {
        return await this.ownerModel.find({ user_id });
    }
    async findAll(): Promise<Ownership[] | null> {
        return await this.ownerModel.find().exec();
    }
    async create(createOwnerDto: any): Promise<Ownership> {
        return this.ownerModel.create(createOwnerDto);
    }

    async getSpecificOwner(user_id: string, store_id: string) {
        return await this.ownerModel.findOne({
            $and: [
                { user_id },
                { store_id },
            ],
        });
    }

}
