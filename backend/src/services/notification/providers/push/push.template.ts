import { NotificationTemplate } from '@services/notification/enums';
import { numberWithCommas, CreditHasher } from '@shared/helpers';

export const pushTemplates = {
  [NotificationTemplate.LOGIN]: (token1: string, token2?: string, token3?: string) => {
    return {
      data: {
        title: 'LOGIN',
        content: `${token1}`,
      }
    };
  },
  [NotificationTemplate.PAYMENT_INCOME]: async (credit_amount: string, name?: string, reference_code?: string) => {
    return {
      data: {
        title: 'واریز',
        content: `مبلغ ${numberWithCommas(await CreditHasher.dehashWalletCredit(credit_amount) / 10)} تومان از طرف ${name} به حساب شما واریز شد`,
        action: {
          url: 'app://shahrpay',
          action_type: 'U',
        },
      },
      custom_content: {
        title: 'واریز',
        content: `مبلغ ${numberWithCommas(await CreditHasher.dehashWalletCredit(credit_amount) / 10)} تومان از طرف ${name} به حساب شما واریز شد`,
      },
    };
  },
  [NotificationTemplate.PAYMENT_OUTCOME]: async (credit_amount: string, name?: string, reference_code?: string) => {
    return {
      data: {
        title: 'برداشت',
        // tslint:disable-next-line: max-line-length
        content: `مبلغ ${numberWithCommas(await CreditHasher.dehashWalletCredit(credit_amount) / 10)} تومان از حساب شما کسر و به حساب ${name} واریز شد.`,
      },
      custom_content: {
        title: 'برداشت',
        // tslint:disable-next-line: max-line-length
        content: `مبلغ ${numberWithCommas(await CreditHasher.dehashWalletCredit(credit_amount) / 10)} تومان از حساب شما کسر و به حساب ${name} واریز شد.`,
      },
    };
  },
};
