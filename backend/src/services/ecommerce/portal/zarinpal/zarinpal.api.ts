import axios, { Method } from 'axios';
import { HttpException, BadRequestException } from '@nestjs/common';

/**
 * Zarinpal
 * @param {String} MerchantID
 * @param {bool} sandbox
 */
export class Zarinpal {
    private sandbox: boolean;
    private merchant: string;
    private baseurl: string;
    private config: any;
    constructor(merchantId: string, sandbox: boolean, config: any) {
        this.config = config;
        if (typeof merchantId === 'string' && merchantId.length === this.config.merchantIdLength) {
            this.merchant = merchantId;
        } else {
            throw new HttpException('The MerchantID must be ' + config.merchantIdLength + ' Characters.', 400);
        }
        this.sandbox = sandbox || false;
        this.baseurl = (sandbox === true) ? config.sandbox : config.https;
    }

    public static tokenBeautifier(token: string): string {
        return token.replace(new RegExp(/\b0+/g), '');
    }
    private async request(apiModule: string, method: Method, data: any) {
        const url: string = this.baseurl + apiModule;
        const response = await axios({
            url,
            method,
            data,
        });
        return response;

    }

    /**
     * Get Authority from ZarinPal
     * @param  {number} Amount [Amount on Tomans.]
     * @param  {String} CallbackURL
     * @param  {String} Description
     * @param  {String} Email
     * @param  {String} Mobile
     */
    public async paymentRequest(input: ZarinpalPaymentRequest): Promise<ZarinpalPaymentRequestRes> {
        const data = {
            MerchantID: this.merchant,
            Amount: input.Amount,
            CallbackURL: input.CallbackURL,
            Description: input.Description,
            Email: input.Email,
            Mobile: input.Mobile,
        };
        try {
            const request = await this.request(this.config.API.PR, 'POST', data);
            const response = request.data;
            return {
                status: response.Status,
                authority: response.Authority,
                url: this.config.PG(this.sandbox) + Zarinpal.tokenBeautifier(response.Authority),
            };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
    /**
     * Validate Payment from Authority.
     * @param  {number} Amount
     * @param  {String} Authority
     */
    public async paymentVerification(input: ZarinpalPaymentVerification): Promise<ZarinpalPaymentVerificationRes> {
        const data = {
            MerchantID: this.merchant,
            Amount: input.Amount,
            Authority: input.Authority,
        };
        try {
            const request = await this.request(this.config.API.PV, 'POST', data);
            const response = request.data;
            return {
                status: response.Status,
                RefID: response.RefID,
            };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
    /**
     * Get Unverified Transactions
     * @param  {number} Amount
     * @param  {String} Authority
     */
    public async unverifiedTransactions() {
        const data = {
            MerchantID: this.merchant,
        };
        try {
            const request = await this.request(this.config.API.UT, 'POST', data);
            const response = request.data;
            return {
                status: response.Status,
                authorities: response.Authorities,
            };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
    /**
     * Refresh Authority
     * @param  {number} Amount
     * @param  {String} Authority
     */
    public async refreshAuthority(input: ZarinpalRefreshAuthority): Promise<ZarinpalRefreshAuthorityRes> {
        const data = {
            MerchantID: this.merchant,
            Authority: input.Authority,
            ExpireIn: input.Expire,
        };
        try {
            const request = await this.request(this.config.API.RA, 'POST', data);
            const response = request.data;
            return {
                status: response.Status,
            };
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}

export interface ZarinpalPaymentVerification {
    readonly Amount;
    readonly Authority;
}
export interface ZarinpalPaymentVerificationRes {
    readonly status;
    readonly RefID;
}

export interface ZarinpalPaymentRequest {
    readonly Amount;
    readonly CallbackURL;
    readonly Description;
    readonly Email?;
    readonly Mobile;
}
export interface ZarinpalPaymentRequestRes {
    readonly status;
    readonly authority;
    readonly url;
}
export interface ZarinpalUnverifiedTransactionsRes {
    readonly status;
    readonly authorities;
}

export interface ZarinpalRefreshAuthority {
    readonly Authority;
    readonly Expire;
}
export interface ZarinpalRefreshAuthorityRes {
    readonly status;
}
