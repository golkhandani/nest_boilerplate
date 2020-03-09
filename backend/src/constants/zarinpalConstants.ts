export const zarinpalConstants = {
    config: {
        https: 'https://www.zarinpal.com/pg/rest/WebGate/',
        sandbox: 'https://sandbox.zarinpal.com/pg/rest/WebGate/',
        merchantIdLength: 36,
        API: {
            PR: 'PaymentRequest.json',
            PRX: 'PaymentRequestWithExtra.json',
            PV: 'PaymentVerification.json',
            PVX: 'PaymentVerificationWithExtra.json',
            RA: 'RefreshAuthority.json',
            UT: 'UnverifiedTransactions.json',
        },
        PG(sandbox) {
            if (sandbox) {
                return 'https://sandbox.zarinpal.com/pg/StartPay/';
            }
            return 'https://www.zarinpal.com/pg/StartPay/';
        },
    },
    merchantId: process.env.ZARINPAL_CONSTANTS_MERCHANTID,
    isSandbox: process.env.ZARINPAL_CONSTANTS_ISSANDBOX === 'true' ? true : true,
};

