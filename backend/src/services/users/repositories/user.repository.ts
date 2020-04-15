import { QueryFindOneAndUpdateOptions } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { User } from '@shared/models';

export class UserRepository {
  constructor(
    @InjectModel(User) private readonly UserModel: ReturnModelType<typeof User>,
  ) { }

  async create(userObj: Partial<User>) {
    const newUser = new this.UserModel(
      Object.assign(userObj, { verified: false }),
    );
    const savedUser = await newUser.save() as User;
    return savedUser;
  }
  async upsertOne(upserObj: Partial<User>) {
    const userObj: User = await this.UserModel.findOneAndUpdate(
      upserObj,
      { new: true }) as User;
    return userObj;
  }
  async find(query: any, options: { skip: number, limit: number }): Promise<User[]> {
    return await this.UserModel.find(query).skip(options.skip).limit(options.limit);
  }
  async findOne(query: any): Promise<User> {
    const fn = await this.UserModel.findOne(query);
    if (fn) {
      return (fn).toJSON();
    } else { return undefined; }

  }

  async findOneAndUpdate(query: any, updates: Partial<User>, options?: QueryFindOneAndUpdateOptions) {
    const eu = await this.UserModel.findOneAndUpdate(
      query,
      { $set: updates },
      options || { new: true },
    );
    return eu.toJSON();
  }

  async findByUniquesForValidation(value: string): Promise<User> {
    return await this.UserModel.findOne({
      $or: [
        { username: value },
        { google: value },
        { email: value },
      ],
    });
  }

}
