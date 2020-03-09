import * as base64 from 'base-64';

import { HttpException } from '@nestjs/common';
export class TokenSubject {
    public static lock(object: any) {
        return base64.encode(JSON.stringify(object));
    }
    public static unlock(str: string) {
        const decoded = base64.decode(str);
        try {
            return JSON.parse(decoded);
        } catch {
            throw new HttpException('invalid token', 403);
        }
    }
}
