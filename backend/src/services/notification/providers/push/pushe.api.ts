import * as axios from 'axios';
import { WLogger } from '@shared/winston/winston.ext';
import { pusheConstants } from '@constants/index';

export class PusheApi {
  private apikey: string;
  private appid: string;
  private baseUrl: string = pusheConstants.baseUrl;
  private serviceUrl: string = pusheConstants.serviceUrl;
  private options: axios.AxiosRequestConfig;
  constructor(initialierObj: { apikey, appid }) {
    this.apikey = initialierObj.apikey;
    this.appid = initialierObj.appid;
    this.options = {
      headers: {
        'authorization': 'Token ' + this.apikey,
        'content-type': 'application/json',
      },
      timeout: 10000000,
    };
  }
  async send(data) {
    data.app_ids = [this.appid];
    const urt = this.baseUrl + this.serviceUrl;
    try {
      const res = await axios.default.post(urt, data, this.options);
    } catch (error) {
      WLogger.error(JSON.stringify(error.response));
    }

  }
}

export const Pushe = (initialierObj) => new PusheApi(initialierObj);
