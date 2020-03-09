import { ControllerNotification } from '@shared/dtos/controller-notification.dto';
import { ControllerNotificationType } from '@shared/enums';

export class ControllerOutputDto<T> {
  data: T;
  notification: ControllerNotification;
  /**
   * create api output
   * @param data
   * @param notificatonMessage
   * @param notificationType
   */
  constructor(data: T, notificatonMessage?: string, notificationType?: ControllerNotificationType) {
    if (notificatonMessage) {
      this.notification = new ControllerNotification(
        notificatonMessage,
        notificationType || ControllerNotificationType.BANNER,
      );
    }
    if (data) {
      this.data = data;
    }
    return {
      data: this.data,
      notification: this.notification,
    };
  }
}
