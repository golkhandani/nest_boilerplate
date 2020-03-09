import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { notificationPlayerSchemaOptions, NotificationPlayer } from '@services/notification/models';

import { NotificationController } from '@services/notification/notification.controller';
import { NotificationService } from '@services/notification/notification.provider';

import { NotificationProcessor } from '@services/notification/providers';

@Module({
  imports: [
    TypegooseModule.forFeature([{
      typegooseClass: NotificationPlayer,
      schemaOptions: notificationPlayerSchemaOptions,
    }]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationProcessor],
  exports: [NotificationService],
})
export class NotificatonModule { }
