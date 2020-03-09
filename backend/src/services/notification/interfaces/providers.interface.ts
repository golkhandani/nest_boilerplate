import { NotificationPlayer } from '../models/notification-player.model';
import { NotificationType } from '../enums/notificationType.enum';

export interface INotificationProvider {
  type: NotificationType;
  to(receptor: Partial<NotificationPlayer>): INotificationProvider;
  message(...args: string[]): INotificationProvider;
  sendByTemplate(template): Promise<any>;
  sendRaw(pushObj): Promise<any>;
}
