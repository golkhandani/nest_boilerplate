import { Injectable, Inject, HttpException, BadRequestException } from '@nestjs/common';
import { User } from '@shared/models';
import { WinstonLoggerName, Logger } from '@shared/winston';

import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { NotificationPlayer } from '@services/notification/models/notification-player.model';
import { NotificationTemplate, NotificationType } from '@services/notification/enums';
import { INotificationProvider } from '@services/notification/interfaces';
import { NotificationProcessor } from '@services/notification/providers';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NotificationService {
  private providers: INotificationProvider[];
  constructor(
    private readonly notificationProccesor: NotificationProcessor,

    // private readonly userService: UsersProfileProvider,
    @Inject(WinstonLoggerName) private readonly logger: Logger,
    @InjectModel(NotificationPlayer) private readonly NotificationPlayerModel: ReturnModelType<typeof NotificationPlayer>,
  ) {
    this.providers = this.notificationProccesor.allProviders;
  }
  /**
   * it calls by user service in order to initiate ways of notifing them
   * @param user User
   */
  async initNotificationPlayer(user: User) {
    const newPlayer = new NotificationPlayer();
    newPlayer.device_id = undefined;
    newPlayer.user_id = user.user_id;
    newPlayer.phone = user.phone;
    newPlayer.email = user.email;
    return await this.NotificationPlayerModel.create(newPlayer);
  }

  /**
   * set new notifier like push,email,etc ...
   * @param user_id user id from header (jwt)
   * @param notifiers {notifier:notifier_id} for example {pushe:pushe_id}
   */
  async setNewNotifiers(user_id: string, notifiers: { [type: string]: string }) {
    const newPlayer = new NotificationPlayer();
    Object.keys(notifiers).map(
      key => newPlayer[key] = notifiers[key],
    );
    const updatedPlayer = await this.NotificationPlayerModel.findOneAndUpdate(
      { user_id },
      { $set: newPlayer },
      { new: true },
    );
    if (!updatedPlayer) {
      throw new BadRequestException('کاربر اشتباه');
    }
    return updatedPlayer;
  }
  /**
   * for gettin notifiers from by user_id
   * @param user_id
   * @returns { player, notifiers } players include way of contacting player
   */
  async getPlayerAndNotifiers(user_id: string): Promise<{ player: NotificationPlayer, notifiers: NotificationType[] }> {
    const player = await this.NotificationPlayerModel.findOne({ user_id });
    const notifiers: NotificationType[] = [];
    if (player.phone) {
      notifiers.push(NotificationType.SMS);
    }
    if (player.email) {
      notifiers.push(NotificationType.EMAIL);
    }
    if (player.device_id) {
      notifiers.push(NotificationType.PUSH);
    }
    return { player, notifiers };
  }

  async sendMessageToSingleUserObservable(
    user_id: string,
    messages: string[],
    notficationTemplate: NotificationTemplate,
    notificationTypes: NotificationType[] = [NotificationType.SMS, NotificationType.PUSH],
  ): Promise<NotificationType[]> {
    const { player, notifiers } = await this.getPlayerAndNotifiers(user_id);
    const validNotifiers = notificationTypes.filter(value => notifiers.includes(value));
    const notificationTypes$ = of(validNotifiers);
    notificationTypes$.pipe(
      map(items =>
        items.map((item: string) => {
          this.notificationProccesor
            .provider(this.providers.find(provider => provider.type.toLowerCase() === item.toLowerCase()))
            .buildNotificationObject(player, messages)
            .sendNotificationObject(notficationTemplate);
        }),
      ),
    ).subscribe();
    return validNotifiers;

  }

  async sendMessageToSinglePhone(
    phone: string,
    messages: string[],
    notficationTemplate: NotificationTemplate) {
    try {
      this.notificationProccesor
        .provider(this.providers.find(provider => provider.type === NotificationType.SMS))
        .buildNotificationObject({ phone }, messages)
        .sendNotificationObject(notficationTemplate);
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, 426);
    }
  }
  // wrong functions
  /*
  async sendMessageToSingleUserByType(
    notify: NotificationPlayer | any,
    messages: string[],
    notficationTemplate: NotificationTemplate,
    notificationType: NotificationType): Promise<void> {
    try {
      let provider: INotificationProvider;
      switch (notificationType) {
        case NotificationType.SMS:
          provider = this.sms.to(notify.phone || notify).message(...messages);
          break;
        case NotificationType.PUSH:
          provider = this.push.to(notify.pushe_id).message(...messages);
          break;
        case NotificationType.EMAIL:
          provider = this.sms.to(notify.phone || notify).message(...messages);
          break;
        default:
          break;
      }
      await provider.sendByTemplate(notficationTemplate);
    } catch (error) {
      throw error;
    }

  }
  async sendMessageToSingleUser(
    user_id: string,
    messages: string[],
    notficationTemplate: NotificationTemplate,
    notificationTypes: NotificationType[] = [NotificationType.SMS]) {
    try {
      const { player, notifiers } = await this.getPlayerAndNotifiers(user_id);
      const validNotifiers = notificationTypes.filter(value => notifiers.includes(value));
      for (const notificationTypeItem of validNotifiers) {
        return this.sendMessageToSingleUserByType(
          player,
          messages,
          notficationTemplate,
          notificationTypeItem,
        );
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, 426);
    }
  }
  */
}
