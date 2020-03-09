import * as rateLimit from 'express-rate-limit';
import * as RedisStore from 'rate-limit-redis';
import * as Redis from 'ioredis';

import { HttpStatus } from '@nestjs/common';

import { redisConstants } from '@constants/redisConstants';

export const rateLimitConstants: rateLimit.Options = {
    store: new RedisStore({
        client: new Redis(redisConstants),
    }),
    windowMs: parseInt(process.env.RATE_LIMIT_CONSTANTS_WINDOWMS, 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_CONSTANTS_MAX, 10),
    handler: (req, res) => {
        return res.status(HttpStatus.TOO_MANY_REQUESTS).send({
            error: 'too many requst',
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
        });
    },
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
};
