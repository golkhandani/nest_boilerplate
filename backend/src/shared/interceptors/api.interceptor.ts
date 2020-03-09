import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { IApi } from '@shared/interfaces';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IApi<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IApi<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = response.statusCode;
        const meta = {
            date: new Date(),
            statusCode: status,
        };
        return next.handle().pipe(map(
            data => {
                return Object.assign(data,
                    {
                        meta,
                    });
            },
        ));
    }
}
