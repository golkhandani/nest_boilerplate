import { ControllerNotificationType } from '@shared/enums';

export class ControllerNotification {
  type: ControllerNotificationType;
  message: string;
  constructor(...args: string[]) {
    this.type = args[0] as ControllerNotificationType || ControllerNotificationType.BANNER;
    this.message = args[1];
    if (this.type !== ControllerNotificationType.NONE) {
      return {
        type: this.type,
        message: this.message,
      };
    } else { return undefined; }
  }
}
