import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        // const user = await this.authProvider.validateUser(username, password);
        // if (!user) {
        //     throw new UnauthorizedException();
        // }
        // return user;
    }
}
