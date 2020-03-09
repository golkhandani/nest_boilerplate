import axios, { Method } from 'axios';
import { RequestMethod, HttpException, BadRequestException } from '@nestjs/common';
import { efardaConstants } from '@constants/index';
export const config = efardaConstants.config;

export class Efarda {
    private username: string;
    private password: string;
    private baseUrl: string;
    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.baseUrl = config.baseUrl;
    }

    private async request(apiModule: string, method: Method, data: any, headers?: { 'Content-Type': string; 'Accept': string; }) {
        const url: string = this.baseUrl + apiModule;
        const input = {
            url,
            method,
            data,
            ...headers,
        };
        const response = await axios(input);
        return response;

    }

    public async paymentRequest(input: PaymentRequestEfarda): Promise<PaymentRequestEfardaResponse> {
        const data = {
            username: this.username,
            password: this.password,
            amount: input.amount * 10,
            Mobile: input.Mobile,
            additionalData: input.additionalData,
            serviceAmountList: input.serviceAmountList,
            callBackUrl: input.callBackUrl,
        };
        try {
            const request = await this.request(config.API.PR, 'POST', data);
            const response = request.data;
            if (response.result !== '0') {
                throw new BadRequestException(response.description);
            }
            return {
                traceNumber: response.traceNumber,
                result: response.result,
                description: response.description,
                doTime: response.doTime,
            };
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    public async callbackRequest(traceNumber: string) {
        const d = {
            username: this.username,
            traceNumber,
        };
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/x-www-form-urlencoded',
        };
        try {
            const data = Object.entries(d)
                .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
                .join('&');
            const request = await this.request(config.API.CbR, 'POST', data, headers);
            const response = request.data;
            return {
                callbackPage: response,
            };
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    public async paymentVerification(input: PaymentVerificationEfarda): Promise<PaymentVerificationResEfarda> {
        const data = {
            username: this.username,
            password: this.password,
            traceNumber: input.traceNumber,
        };
        try {
            const request = await this.request(config.API.PV, 'POST', data);
            const response = request.data;
            return response;
        } catch (err) {
            throw new BadRequestException(err);
        }
    }
}

export interface PaymentVerificationEfarda {
    readonly traceNumber: string;
}
export interface PaymentVerificationResEfarda {
    readonly traceNumber: string;
    readonly result: string;
    readonly description: string;
    readonly doTime: string;
    readonly rrn: string;
    readonly serviceAmountList: string;
    readonly type: string;
}
export interface ServiceAmountEfarda {
    readonly serviceId: string;
    readonly amount: string;
}
export interface PaymentRequestEfarda {
    readonly callBackUrl: string;
    readonly amount: number;
    readonly Mobile: string;
    readonly additionalData: string;
    readonly serviceAmountList: ServiceAmountEfarda[];
}

export interface PaymentRequestEfardaResponse {
    readonly traceNumber: string;
    readonly result: string;
    readonly description: string;
    readonly doTime: string;
}
export interface CallbackRequestEfarda {
    readonly traceNumber: string;
}
export interface CallbackRequestEfardaResponse {
    readonly callbackPage: string;
}
const EFARDA_USERNAME = efardaConstants.username;
const EFARDA_PASSWORD = efardaConstants.password;
export const EfardaInstance = new Efarda(EFARDA_USERNAME, EFARDA_PASSWORD);
