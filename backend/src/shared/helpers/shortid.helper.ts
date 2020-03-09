import * as shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
// export const shortId = shortid;

import * as nanoid from 'nanoid';
import * as generate from 'nanoid/generate';

export const shortId = {
  generate: () => generate('0123456789', 8),
};
