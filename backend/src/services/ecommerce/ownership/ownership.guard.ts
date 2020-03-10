
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRoles } from '@shared/models/users.model';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';
import { OwnershipProvider } from './ownership.provider';
import { Request } from 'express';

/**
 * decorator for role base authentication
 * @param roles USER_ROLES
 */
export const AccessLevels = (...accessLevels: string[]) => SetMetadata('accessLevels', accessLevels);

@Injectable()
export class OwnershipGuard extends AuthGuard('jwt') {
    constructor(
        @Inject(OwnershipProvider.name)
        private readonly ownershipProvider: OwnershipProvider,
        private readonly reflector: Reflector,
    ) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        /**
         * retrun True if no role provided
         */
        const roles = [UserRoles.SELLER]; // this.reflector.get<string[]>('roles', context.getHandler()) ||;
        const accessLevels = this.reflector.get<string[]>('accessLevels', context.getHandler());
        if (!roles && !accessLevels) {
            return true;
        }
        /**
         * retrun false if no user(token) provided
         */
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        const store_id = request.params.store_id;
        const ownership = await this.ownershipProvider.getSpecificOwner(user.user_id, store_id);
        if (ownership) { request.user.ownership = ownership; }
        if (!user || !user.role) {
            throw new UnauthorizedException();
        }
        const hasRole = () => {
            if (!roles) {
                return true;
            } else {
                return roles.includes(user.role);
            }
        };
        const hasAccessLevel = () => {
            if (!accessLevels) {
                return true;
            } else if (!ownership.access_levels) {
                return false;
            } else {
                return ownership.access_levels.some((accessLevel) => accessLevels.includes(accessLevel));
            }
        };

        return user && user.role && hasRole() && hasAccessLevel();
    }

}
