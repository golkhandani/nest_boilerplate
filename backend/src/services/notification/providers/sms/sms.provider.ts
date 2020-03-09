import { Injectable } from '@nestjs/common';
import { kavenegarConstants } from '@constants/index';

import { Kavenegar, KavenegarSmsType } from '@services/notification/providers/sms';
import { INotificationProvider } from '@services/notification/interfaces';
import { NotificationPlayer } from '@services/notification/models';
import { NotificationType } from '@services/notification/enums';

@Injectable()
export class SmsProvider implements INotificationProvider {
  public type = NotificationType.SMS;
  private kavenegar: any;
  private receptor: string;
  private token1: string;
  private token2: string;
  private token3: string;
  private timeout: number = 10000;
  constructor() {
    this.kavenegar = Kavenegar({ apikey: kavenegarConstants.apiKey });
  }
  to(player: NotificationPlayer) {
    this.receptor = player.phone;
    return this;
  }

  message(...args: string[]) {
    this.token1 = args[0].replace(' ', '-');
    this.token2 = (args[1] || '').replace(' ', '-');
    this.token3 = (args[2] || '').replace(' ', '-');
    return this;
  }

  async send(type = KavenegarSmsType.TEMPLATE, template = kavenegarConstants.login) {
    switch (type) {
      case 'SENDER':
        return this.sendByNumber();
      case 'TEMPLATE':
        return this.sendByTemplate(template);
      default:
        return this.sendByTemplate(template);
    }
  }
  sendByNumber(sender = kavenegarConstants.sender) {
    return new Promise((resolve, reject) => {
      this.kavenegar.Send({
        message: this.token1,
        sender,
        receptor: this.receptor,
      }, (response, status) => {
        setTimeout(() => {
          reject({
            message: {
              message: 'KVN...' + status,
              status: 504,
            },
          });
        }, this.timeout);
        if (status === 200) {
          resolve({ response, status });
        } else {
          reject({
            message: {
              message: 'KVN...' + status,
              status,
            },
          });
        }
      });
    });
  }
  sendByTemplate(template) {
    return new Promise((resolve, reject) => {
      this.kavenegar.VerifyLookup({
        token: this.token1,
        token2: this.token2,
        token3: this.token3,
        receptor: this.receptor,
        template,
      }, (response, status) => {
        setTimeout(() => {
          reject({
            message: {
              message: 'KVN...' + status,
              status: 504,
            },
          });
        }, this.timeout);
        if (status === 200) {
          resolve({ response, status });
        } else {
          reject({
            message: {
              message: 'KVN...' + status,
              status,
            },
          });
        }
      });
    });
  }
  sendRaw(notifObj) {
    return new Promise((resolve, reject) => {
      this.kavenegar.Send({
        message: this.token1,
        sender: kavenegarConstants.sender,
        receptor: this.receptor,
      }, (response, status) => {
        setTimeout(() => {
          reject({
            message: {
              message: 'KVN...' + status,
              status: 504,
            },
          });
        }, this.timeout);
        if (status === 200) {
          resolve({ response, status });
        } else {
          reject({
            message: {
              message: 'KVN...' + status,
              status,
            },
          });
        }
      });
    });
  }

}
