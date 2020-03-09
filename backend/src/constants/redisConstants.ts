export const redisConstants = {
    host: process.env.REDIS_CONSTANTS_HOST,
    password: process.env.REDIS_CONSTANTS_PASSWORD,
    port: parseInt(process.env.REDIS_CONSTANTS_PORT, 10),
    ttl: parseInt(process.env.REDIS_CONSTANTS_TTL, 10), // seconds
    max: parseInt(process.env.REDIS_CONSTANTS_MAX, 10), // maximum number of items in cache
};
