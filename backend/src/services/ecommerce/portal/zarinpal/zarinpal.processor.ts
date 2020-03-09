import { IVerifyDetail } from '../interfaces/verifyDetail.interface';
import { IPaymentDetail } from '../interfaces/paymentDetail.interface';
import { IPaymentProcessor } from '../interfaces/paymentProcessor.interface';
import {
    ZarinpalPaymentRequest,
    ZarinpalPaymentRequestRes,
    Zarinpal,
    ZarinpalPaymentVerificationRes,
    ZarinpalPaymentVerification,
} from './zarinpal.api';
import { CreditHasher } from '@shared/helpers/creditHashing.helper';
import { PortalName } from '../enums/portalName.enum';
import { zarinpalConstants } from '@constants/index';

export class ZarinpalProcessor implements IPaymentProcessor {

    private zconfig = zarinpalConstants.config;
    private zMerchantId = zarinpalConstants.merchantId;

    private zSandbox = zarinpalConstants.isSandbox;

    public protalName = PortalName.ZARINPAL;
    private py: Zarinpal;
    constructor() {
        this.py = new Zarinpal(this.zMerchantId, this.zSandbox, this.zconfig);

    }
    // TODO fix single responsibility violation
    async pay(detail: IPaymentDetail): Promise<string> {
        const data = {
            Amount: await CreditHasher.dehashWalletCredit(detail.Amount) / 10,
            CallbackURL: detail.CallbackURL,
            Description: detail.Description,
            Email: detail.Email,
            Mobile: detail.Mobile,
        };
        const paymentRequest: ZarinpalPaymentRequestRes = await this.py.paymentRequest(data as ZarinpalPaymentRequest);
        return paymentRequest.url;
    }
    async verify(detail: IVerifyDetail): Promise<any> {
        const data: ZarinpalPaymentVerification = {
            Amount: await CreditHasher.dehashWalletCredit(detail.Amount) / 10,
            Authority: detail.Authority,
        };
        const paymentRequest: ZarinpalPaymentVerificationRes = await this.py.paymentVerification(data as ZarinpalPaymentVerification);
        return { status: paymentRequest.status, RefID: paymentRequest.RefID };
    }

}
