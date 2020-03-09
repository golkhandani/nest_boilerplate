import { Injectable } from '@nestjs/common';
import { pushTemplates, Pushe, PusheApi } from '@services/notification/providers/push';
import { NotificationType, NotificationTemplate } from '@services/notification/enums';
import { INotificationProvider } from '@services/notification/interfaces';
import { NotificationPlayer } from '@services/notification/models';
import { pusheConstants } from '@constants/index';

const sim_notif = {
  app_ids: ['UNIQUE_IDENTIFIER_GENERATED_BY_PUSHE'],
  data: {
    title: 'عنوان پیام',
    content: 'محتوای پیام',
  },
};

const adv_notif = {
  app_ids: [
    'UNIQUE_IDENTIFIER_GENERATED_BY_PUSHE',
  ],
  data: {
    title: 'عنوان',
    content: 'تیتر',
    big_title: 'تیتر کامل',
    big_content: 'متن بزرگ',
    summary: 'چکیده ',
    image: 'http://url/name.png',
    icon: 'http://url/name.png',
    ticker: 'متن نوار اعلان',
    notif_icon: 'file_download',
    wake_screen: true,
    sound_url: 'http://static.pushe.co/mp3/2.mp3',
    visibility: true,
    led_color: '-8206336',
    show_app: true,
    led_on: 300,
    led_off: 500,
    delay_until: true,
    action: {
      url: 'tg://join?invite=sdfdsfdsfds',
      action_type: 'U',
    },
    buttons: [
      {
        btn_icon: 'fileـdownload',
        btn_order: 1,
        btn_content: 'متن دکمه',
        btn_action: {
          url: 'tg://join?invite=fdsfdsfds',
          action_type: 'U',
        },
      },
      {
        btn_icon: 'local_cafe',
        btn_order: 2,
        btn_content: 'متن دکمه',
        btn_action: {
          url: 'http://fgfdgfdg.com',
          action_type: 'U',
        },
      },
      {
        btn_icon: 'phoneـandroid',
        btn_order: 3,
        btn_content: 'متن دکمه',
        btn_action: {
          url: 'call:dddd',
          action_type: 'U',
        },
      },
    ],
  },
  filters: {
    operator: [
      'ir-mci', 'irancell', 'rightel',
    ],
    brand: [
      'samsung', 'LGE', 'asus', 'htc', 'lenovo', 'sony', 'huawei',
    ],
    mobile_net: [
      'lte', 'wifi',
    ],
    state: [
      'East Azerbaijan', 'Azarbayjan-e Gharbi', 'Ardabil', 'Isfahan', 'Alborz', 'Ilam', 'Bushehr', 'Tehran', 'Chahar Mahall va Bakhtiari',
      'Khorasan-e Jonubi', 'Razavi Khorasan', 'Khorasan-e Shomali', 'Khuzestan', 'Zanjan', 'Semnan', 'Sistan and Baluchestan', 'Fars',
      'Qazvin', 'Qom', 'Kordestan', 'Kerman', 'Kermanshah', 'Kohgiluyeh va Buyer Ahmad', 'Golestan', 'Gilan', 'Lorestan', 'Mazandaran',
      'Markazi', 'Hormozgan', 'Hamadan', 'Yazd',
    ],
    app_version: [
      '1.0', '2.0',
    ],
  },
  collapse_key: 'key1',
  time_to_live: 172800,
  topics: ['topic_name1'],
  unique: true,
  eta: '2016-10-18T13:28:00+03:30',
  rate_limit: 'بزودی',
  platform: 1,
  priority: 1,
  abt_ids: ['notification_wrapper_id'],
};
const notif_without_show = {
  app_ids: ['UNIQUE_IDENTIFIER_GENERATED_BY_PUSHE'],
  data: {
    show_app: false,
  },
  custom_content: {
    key_1: 'Value_1',
    Key_2: 'Value_2',
  },
  priority: 2,

};
const notif_by_deviceid = {
  app_ids: ['UNIQUE_IDENTIFIER_GENERATED_BY_PUSHE'],
  filters: {
    pushe_id: ['pid_20aa-ba40-a0', 'pid_39ca-ee30-d9'],
  },
  data: {
    title: 'عنوان پیام',
    content: 'محتوای پیام',
  },
};

@Injectable()
export class PushProvider implements INotificationProvider {
  public type = NotificationType.PUSH;
  private pushe: PusheApi;

  private token1: string;
  private token2: string;
  private token3: string;
  private body: any = {};
  constructor() {
    this.pushe = Pushe({ apikey: pusheConstants.apiKey, appid: pusheConstants.appid });
  }
  to(player: NotificationPlayer) {
    // TODO add a way for ios
    this.body.filters = {
      custom_id: [player.user_id],
    };
    return this;
  }

  message(...args) {
    this.token1 = args[0];
    this.token2 = args[1] || '';
    this.token3 = args[2] || '';
    return this;
  }
  json(custom_content) {
    this.body.data = Object.assign(this.body.data || {},
      {
        show_app: false,
      });
    this.body.custom_content = custom_content;
    this.body.priority = 2;
    return this;
  }

  async sendByTemplate(notficationTemplate: NotificationTemplate) {
    const data = await pushTemplates[notficationTemplate](
      this.token1,
      this.token2,
      this.token3,
    );
    console.log('sendByTemplate', data);
    this.body = Object.assign(this.body, data);
    await this.pushe.send(this.body);
  }
  async sendRaw(pushObj: any) {
    this.body.data = Object.assign(
      this.body.data || {},
      { show_app: true },
      pushObj,
    );
    await this.pushe.send(this.body);
  }
}
