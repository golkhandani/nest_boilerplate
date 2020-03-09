import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Reseller } from './models/reseller.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { bcryptConstants } from '@constants/index';
import { genSaltSync, hashSync, compare } from 'bcrypt';
import * as uuid from 'node-uuid';

@Injectable()
export class ResellerService {
  constructor(
    @InjectModel(Reseller) private readonly ResellerModel: ReturnModelType<typeof Reseller>,
  ) { }

  public async findAndValidate(public_key: string, secret_key: string) {
    const reseller = await this.ResellerModel.findOne({ public_key });
    if (!reseller) {
      return { isValid: false, reseller };
    }
    const isValid = await compare(secret_key, reseller.secret_key || '');
    return { isValid, reseller };
  }
  private hash(str: string) {
    const str_salt = genSaltSync(bcryptConstants.saltRounds);
    const str_hashed = hashSync(str, str_salt);
    return str_hashed;
  }
  async createResseller(createResellerDto) {
    const newReseller = new this.ResellerModel(createResellerDto);
    newReseller.public_key = uuid.v4();
    const secret_key = uuid.v4();
    newReseller.secret_key = this.hash(secret_key);
    const saved = await newReseller.save();
    return {
      name: saved.name,
      reseller_id: saved.reseller_id,
      public_key: saved.public_key,
      secret_key,
    };
  }
}
