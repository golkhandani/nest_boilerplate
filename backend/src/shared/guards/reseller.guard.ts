
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException, Inject, createParamDecorator } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@shared/models/users.model';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';
import { Request } from 'express';
import { ResellerService } from '@services/businesses/reseller.provider';

export const ResellerFromHeader = createParamDecorator((data: string, req): User => {
  return data ? req.reseller && req.reseller[data] : req.reseller;
});

@Injectable()
export class ResellerGuard implements CanActivate {
  constructor(
    @Inject(ResellerService.name)
    private readonly resellerService: ResellerService,
    private readonly reflector: Reflector,
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const public_key = request.headers.public_key as string;
    const secret_key = request.headers.secret_key as string;
    const { isValid, reseller } = await this.resellerService.findAndValidate(public_key, secret_key);
    (request as any).reseller = reseller;
    return isValid;
  }

}
