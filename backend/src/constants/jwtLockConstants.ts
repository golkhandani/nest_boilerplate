export const jwtLockConstants = {
    expirationInterval: parseInt(process.env.JWT_LOCK_CONSTANTS_EXPIRATION_INTERVAL, 10), // day
    expiresIn: process.env.JWT_LOCK_CONSTANTS_EXPIRES_IN,
    algorithm: process.env.JWT_LOCK_CONSTANTS_ALGORITHM,
    public_key: process.env.JWT_LOCK_CONSTANTS_PUBLIC_KEY.replace(/\\n/g, '\n'),
    private_key: process.env.JWT_LOCK_CONSTANTS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    issuer: process.env.JWT_LOCK_CONSTANTS_PRIVATE_ISSUER,
    audience: process.env.JWT_LOCK_CONSTANTS_PRIVATE_AUDIENCE,
};
