import { NotificationTemplate } from '@services/notification/enums';
import { numberWithCommas, CreditHasher } from '@shared/helpers';

export const pushTemplates = {
  [NotificationTemplate.LOGIN]: (token1: string, token2?: string, token3?: string) => {
    return {
      data: {
        title: 'LOGIN',
        content: `${token1}`,
      },
    };
  },
  [NotificationTemplate.PAYMENT_INCOME]: async (credit_amount: string, name?: string, reference_code?: string) => {
    return {
      data: {
        title: 'xxx',
        content: 'xxx',
        action: {
          url: 'app://xxx',
          action_type: 'U',
        },
      },
      custom_content: {
        title: 'xxx',
        content: 'xxx',
      },
    };
  },
  [NotificationTemplate.PAYMENT_OUTCOME]: async (credit_amount: string, name?: string, reference_code?: string) => {
    return {
      data: {
        title: 'xxx',
        content: 'xxx',
      },
      custom_content: {
        title: 'xxx',
        content: 'xxx'
      },
    };
  },
};
