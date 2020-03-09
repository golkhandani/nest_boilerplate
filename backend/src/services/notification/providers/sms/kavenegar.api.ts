import * as https from 'https';
import * as querystring from 'querystring';
import { kavenegarConstants } from '@constants/index';

// TODO create ts version
const KavenegarApi = function (options) {
    this.options = {};
    this.options.host = kavenegarConstants.host;
    this.options.version = kavenegarConstants.version;
    this.options.apikey = options.apikey;
};
KavenegarApi.prototype.request = function (action, method, params, callback) {
    const path = '/' + this.options.version + '/' + this.options.apikey + '/' + action + '/' + method + '.json';
    const postdata = querystring.stringify(params);
    const post_options = {
        host: this.options.host,
        port: '443',
        path,
        method: 'POST',
        headers: {
            'Content-Length': postdata.length,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
    };
    const req = https.request(post_options, function (e) {
        e.setEncoding('utf8');
        let result = '';
        e.on('data', function (data) {
            result += data;
        });
        e.on('end', function () {
            try {
                const jsonObject = JSON.parse(result);
                if (callback) {
                    callback(
                        jsonObject.entries,
                        jsonObject.return.status,
                        jsonObject.return.message,
                    );
                }
            } catch (e) {
                if (callback) {
                    callback([], 500, e.message);
                }
            }
        });
    });
    req.write(postdata, 'utf8');
    req.on('error', function (e) {
        if (callback) {
            callback(JSON.stringify({
                error: e.message,
            }));
        }
    });
    req.end();
};
KavenegarApi.prototype.Send = function (data, callback) {
    this.request('sms', 'send', data, callback);
};
KavenegarApi.prototype.SendArray = function (data, callback) {
    this.request('sms', 'sendarray', data, callback);
};
KavenegarApi.prototype.Status = function (data, callback) {
    this.request('sms', 'status', data, callback);
};
KavenegarApi.prototype.StatusLocalMessageid = function (data, callback) {
    this.request('sms', 'statuslocalmessageid', data, callback);
};
KavenegarApi.prototype.Select = function (data, callback) {
    this.request('sms', 'select', data, callback);
};
KavenegarApi.prototype.SelectOutbox = function (data, callback) {
    this.request('sms', 'selectoutbox', data, callback);
};
KavenegarApi.prototype.LatestOutbox = function (data, callback) {
    this.request('sms', 'latestoutbox', data, callback);
};
KavenegarApi.prototype.CountOutbox = function (data, callback) {
    this.request('sms', 'countoutbox', data, callback);
};
KavenegarApi.prototype.Cancel = function (data, callback) {
    this.request('sms', 'cancel', data, callback);
};
KavenegarApi.prototype.Receive = function (data, callback) {
    this.request('sms', 'receive', data, callback);
};
KavenegarApi.prototype.CountInbox = function (data, callback) {
    this.request('sms', 'countinbox', data, callback);
};
KavenegarApi.prototype.CountPostalCode = function (data, callback) {
    this.request('sms', 'countpostalcode', data, callback);
};
KavenegarApi.prototype.SendByPostalCode = function (data, callback) {
    this.request('sms', 'sendbypostalcode', data, callback);
};
KavenegarApi.prototype.VerifyLookup = function (data, callback) {
    this.request('verify', 'lookup', data, callback);
};
KavenegarApi.prototype.AccountInfo = function (data, callback) {
    this.request('account', 'info', data, callback);
};
KavenegarApi.prototype.AccountConfig = function (data, callback) {
    this.request('account', 'config', data, callback);
};
KavenegarApi.prototype.CallMakeTTS = function (data, callback) {
    this.request('call', 'maketts', data, callback);
};

export const Kavenegar = function (options) {
    const obj = new KavenegarApi(options);
    return obj;
};
