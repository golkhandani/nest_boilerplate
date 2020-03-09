import { Module, CacheModule } from '@nestjs/common';
import { redisConstants } from '@constants/index';
import * as redisStore from 'cache-manager-redis-store';
import { TypegooseModule } from 'nestjs-typegoose';

import { AuthorizationController } from '@services/authorization/authorization.controller';
import { AuthorizationProvider } from '@services/authorization/authorization.provider';
import { UserScope, userScopeSchemaOptions } from '@services/authorization/models';
import { LocalStrategy, JwtStrategy } from '@services/authorization/strategies';
import { UserScopeRepository } from '@services/authorization/repositories';

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            ...redisConstants,
        }),
        TypegooseModule.forFeature([{
            typegooseClass: UserScope,
            schemaOptions: userScopeSchemaOptions,
        }]),
    ],
    providers: [
        AuthorizationProvider,
        LocalStrategy,
        JwtStrategy,
        UserScopeRepository,
    ],
    controllers: [
        AuthorizationController,
    ],
    exports: [
        AuthorizationProvider,
    ],
})
export class AuthorizationModule { }
