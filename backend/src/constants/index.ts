import * as fs from 'fs-extra';

function setDevEnv() {
    const path = `${process.cwd()}/development.env`;
    if (fs.existsSync(path)) {
        const result = require('dotenv').config({ path });
    } else { return; }
}
setDevEnv();

export * from './bcryptConstants';
export * from './efardaConstants';
export * from './googleConstants';
export * from './jwtLockConstants';
export * from './jwtUnlockConstants';
export * from './kavenegarConstants';
export * from './keyConstants';
export * from './mongoConstants';
export * from './phoneConstants';
export * from './pusheConstants';
export * from './rateLimitConstants';
export * from './redisConstants';
export * from './serverConstants';
export * from './winstonLoggerConstants';
export * from './zarinpalConstants';
