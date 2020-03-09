import { IVerifyDetail } from './interfaces/verifyDetail.interface';
import { IPaymentDetail } from './interfaces/paymentDetail.interface';
import { IPaymentProcessor } from './interfaces/paymentProcessor.interface';
import { ZarinpalProcessor } from './zarinpal/zarinpal.processor';

export class PaymentRequest {

    public processors: IPaymentProcessor[] = [new ZarinpalProcessor()];
    private _processor: IPaymentProcessor;
    setProcessor(processor: IPaymentProcessor): PaymentRequest {
        this._processor = processor;
        return this;
    }
    async getPaymentUrl(data: IPaymentDetail): Promise<string> {
        return await this._processor.pay(data);
    }

    async getVerifyResponse(data: IVerifyDetail) {
        return await this._processor.verify(data);
    }

}
