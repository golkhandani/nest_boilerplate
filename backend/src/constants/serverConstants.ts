export const serverConstants = {
    producton: process.env.SERVER_CONSTANTS_PRODUCTON === 'true' ? true : true,
    domain: process.env.SERVER_CONSTANTS_DOMAIN,
    imagePrefix: process.env.SERVER_CONSTANTS_IMAGE_PREFIX,
    port: parseInt(process.env.SERVER_CONSTANTS_PORT, 10),
};
