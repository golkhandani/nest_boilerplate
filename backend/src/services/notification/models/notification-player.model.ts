import * as mongoose from 'mongoose';
import * as uuid from 'node-uuid';

import { prop } from '@typegoose/typegoose';

import { IsOptional } from 'class-validator';

export const notificationPlayerSchemaOptions: mongoose.SchemaOptions = {
  collection: 'notification_player',
  timestamps: true,
  autoIndex: true,
};

export class NotificationPlayer {
  @IsOptional()
  @prop({
    default: () => uuid.v4(),
    index: true,
  })
  notification_player_id: string;

  @IsOptional()
  @prop({
    type: String,
    index: true,
  })
  user_id: string;

  @IsOptional()
  @prop({
    type: String,
    index: true,
  })
  device_id: string;
  @IsOptional()
  @prop({
    type: String,
    index: true,
  })
  android_id: string;
  @IsOptional()
  @prop({
    type: String,
    index: true,
  })
  pushe_id: string;
  @IsOptional()
  @prop({
    type: String,
    index: true,
  })
  app_token: string;

  @IsOptional()
  @prop({
    type: String,
    index: true,
  })
  // phone
  phone: string;

  @IsOptional()
  @prop({
    type: String,
    index: true,
  })
  email: string;
}
