import { InjectModel } from 'nestjs-typegoose';
import { PhoneVerification } from '@services/authentication/models';
import { ReturnModelType } from '@typegoose/typegoose';
import { QueryFindOneAndUpdateOptions } from 'mongoose';

export class PhoneVerificationRepository {
  constructor(
    @InjectModel(PhoneVerification) private readonly PhoneVerificationModel: ReturnModelType<typeof PhoneVerification>,
  ) { }
  async create(phoneVerficationObj: Partial<PhoneVerification>) {
    const newVerification = new this.PhoneVerificationModel(phoneVerficationObj);
    return await newVerification.save();
  }
  async findOne(query: any) {
    return await this.PhoneVerificationModel.findOne(query);
  }
  async findOneAndUpdate(query: any, updates: Partial<PhoneVerification>, options?: QueryFindOneAndUpdateOptions) {
    const eu = await this.PhoneVerificationModel.findOneAndUpdate(query, updates, options || { new: true });
    return eu.toJSON();
  }
  async findOneAndRemove(query: any) {
    const rm = await this.PhoneVerificationModel.findOneAndRemove(query);
    return rm;
  }
}
