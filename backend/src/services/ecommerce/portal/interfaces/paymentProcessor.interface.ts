import { PortalName } from '../enums/portalName.enum';
import { IVerifyDetail } from './verifyDetail.interface';
import { IPaymentDetail } from './paymentDetail.interface';
export interface IPaymentProcessor {
    protalName: PortalName;
    pay(detail: IPaymentDetail): Promise<string>;
    verify(detail: IVerifyDetail): Promise<any>;
}
