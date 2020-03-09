import { InjectModel } from 'nestjs-typegoose';
import { RefreshToken } from '@services/authentication/models';
import { ReturnModelType } from '@typegoose/typegoose';
import { QueryFindOneAndUpdateOptions } from 'mongoose';

export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken) private readonly RefreshTokenModel: ReturnModelType<typeof RefreshToken>,
  ) { }

  async create(refreshTokenObj: Partial<RefreshToken>) {
    const newRefreshToken = new this.RefreshTokenModel(refreshTokenObj);
    const saved = await newRefreshToken.save();
    return saved;
  }
  async findOne(query: any) {
    const fn = await this.RefreshTokenModel.findOne(query);
    return fn.toJSON();
  }
  async findOneAndRemove(query: any) {
    const rm = await this.RefreshTokenModel.deleteOne(query);
    return rm;
  }
}
