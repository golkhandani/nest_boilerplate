export const kavenegarConstants = {
  apiKey: process.env.KAVENEGAR_CONSTANTS_APIKEY,
  timeout: parseInt(process.env.KAVENEGAR_CONSTANTS_TIMEOUT, 10), // ms
  sender: parseInt(process.env.KAVENEGAR_CONSTANTS_SENDER, 10),
  login: process.env.KAVENEGAR_CONSTANTS_LOGIN,
  host: process.env.KAVENEGAR_CONSTANTS_HOST,
  version: process.env.KAVENEGAR_CONSTANTS_VERSION,
};
