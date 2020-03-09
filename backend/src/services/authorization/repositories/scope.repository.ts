import { QueryFindOneAndUpdateOptions } from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { UserScope } from '@services/authorization/models';

export class UserScopeRepository {
  constructor(
    @InjectModel(UserScope) private readonly UserScopeModel: ReturnModelType<typeof UserScope>,
  ) { }

  async findOne(query: any) {
    const fn = await this.UserScopeModel.findOne(query);
    return fn;
  }
  async create(userScopeObj: Partial<UserScope>) {
    const savedScopes = await this.UserScopeModel.create(userScopeObj);
    return savedScopes;
  }

  async findOneAndUpdate(query: any, updates: Partial<UserScope>, options?: QueryFindOneAndUpdateOptions) {
    const eu = await this.UserScopeModel.findOneAndUpdate(
      query,
      { $set: updates },
      options || { new: true },
    );
    return eu.toJSON();
  }

}
