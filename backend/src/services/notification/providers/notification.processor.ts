import { NotImplementedException, Injectable } from '@nestjs/common';

import { INotificationProvider } from '@services/notification/interfaces/providers.interface';
import { NotificationPlayer } from '@services/notification/models/notification-player.model';
import { PushProvider } from '@services/notification/providers/push/push.provider';
import { SmsProvider } from '@services/notification/providers/sms/sms.provider';

@Injectable()
export class NotificationProcessor {

  public allProviders = [new SmsProvider(), new PushProvider()];
  private _provider: INotificationProvider;
  provider(provider: INotificationProvider) {
    this._provider = provider;
    return this;
  }
  buildNotificationObject(
    player: Partial<NotificationPlayer>,
    messages: string[],
  ) {
    if (!this._provider) { throw new NotImplementedException(); }
    this._provider.to(player).message(...messages);
    return this;
  }
  async sendNotificationObject(
    notficationTemplate,
  ): Promise<void> {
    if (!this._provider) { throw new NotImplementedException(); }
    await this._provider.sendByTemplate(notficationTemplate);
  }
}
