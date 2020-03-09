import { Controller, Get, Post, Body, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserGuard as RoleGuard } from '@shared/guards';
import { UserFromHeader } from '@shared/decorators';
import { NotificationType, NotificationTemplate } from '@services/notification/enums';

import { NotificationService } from '@services/notification/notification.provider';

@Controller(NotificationController.path)
@ApiTags(NotificationController.path)
export class NotificationController {

  public static path: string = 'notifications';
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  @UseGuards(RoleGuard)
  @Put('self/notifiers')
  async addNewNotifier(
    @UserFromHeader() userinfo: { user_id: string },
    @Body('notifier') notifier: { type: NotificationType, value: string },
    @Body('notifiers') notifiers: { [type: string]: string },
  ) {
    // throw new BadRequestException('Dadsa');
    // return await this.notificationService.setNewNotifier(userinfo.user_id, notifier);
    return await this.notificationService.setNewNotifiers(userinfo.user_id, notifiers);
  }
  @Post()
  async sendNotif(
    @Body('notification') notification: {
      user_id: string,
      messages: string[],
      template: NotificationTemplate,
      types: NotificationType[],
    },
  ) {
    return await this.notificationService.sendMessageToSingleUserObservable(
      notification.user_id,
      notification.messages,
      notification.template,
      notification.types,
    );
  }
}
