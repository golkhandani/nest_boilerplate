export interface IPaymentDetail {
    readonly Amount: string;
    readonly CallbackURL: string;
    readonly Description: string;
    readonly Email?: string;
    readonly Mobile?: string;
}
