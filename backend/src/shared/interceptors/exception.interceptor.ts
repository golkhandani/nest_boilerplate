import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { serverConstants } from '@constants/index';
import { ControllerNotification } from '@shared/dtos/controller-notification.dto';
import { ControllerNotificationType } from '@shared/enums';
const messages = {
  401: 'درسترسی لازم را ندارید',
};
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    let notification: ControllerNotification;
    if (status >= 400 && typeof (exception.message.message || exception.message) !== 'object') {
      notification = {
        message: exception.message.message || exception.message,
        type: ControllerNotificationType.BANNER,
      };
    }

    const meta = {
      statusCode: status,
      date: new Date().toISOString(),
      path: request.url,
      error: !serverConstants.producton ? exception.stack : exception?.message?.error,
    };
    response
      .status(status)
      .json({
        meta,
        notification,
      });
  }
}
