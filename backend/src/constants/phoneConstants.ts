export const phoneConstants = {
    expirationInterval: parseInt(process.env.PHONE_CONSTANTS_EXPIRATION_INTERVAL, 10),
    nextTryTimeInterval: parseInt(process.env.PHONE_CONSTANTS_NEXT_TRY_TIME_INTERVAL, 10),
};
