import { HttpException, Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ICacheManager } from '@shared/interfaces/cache.interface';
import { JwtPayload } from '@shared/models/jwtPayload.model';

import { jwtUnlockConstants } from '@constants/index';

import { AuthorizationProvider } from '@services/authorization/authorization.provider';
import { UserScopes } from '@services/authorization/models/scope.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    private readonly jwtBlockListKey: string = 'jwt_blocked';
    private blocked: string[] = [];
    constructor(
        private readonly authorizationProvider: AuthorizationProvider,
        @Inject(CACHE_MANAGER) private readonly cacheManager: ICacheManager) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
            ignoreExpiration: true,
            secretOrKey: jwtUnlockConstants.public_key,
        });
        this.setBlockList(cacheManager);
    }

    private async setBlockList(cacheManager: ICacheManager) {
        this.blocked.concat((await cacheManager.get('jwt_blocked')) || []);
    }

    /**
     * return unsign token
     * to reach this step should send a token with some requirment
     * for example structure , correct secret and valid expire time
     * @param payload JwtPayload
     */
    async validate(payload: JwtPayload) {
        // const unlocked = TokenSubject.unlock(payload.sub) as User;
        if (this.blocked.includes(payload.user_id)) {
            return new HttpException('you are blocked', 403);
        } else {
            payload.scopes = (await this.authorizationProvider.getScopes(payload.user_id) || []).concat([UserScopes.ME]);
            return payload;
        }
    }
}
