export const keyConstants = {
    secret: process.env.KEY_CONSTANTS_SECRET,
    general_key: process.env.KEY_CONSTANTS_GENERAL_KEY.replace(/\\n/g, '\n'),
};
