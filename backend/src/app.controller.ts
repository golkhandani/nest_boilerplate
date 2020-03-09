import { Controller, Get, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBasicAuth } from '@nestjs/swagger';
import { WinstonLoggerName, Logger } from '@shared/winston';
import { ControllerOutputDto } from '@shared/dtos/controller-output.dto';

@ApiBasicAuth()
@Controller()
export class AppController {
  constructor(@Inject(WinstonLoggerName) private readonly logger: Logger) {
  }

  @Get('ping')
  ping(): string {
    this.logger.info('EDwqe');
    // Winston.error('error');
    // Winston.info('info');
    // Winston.warn('info');
    return 'pong';
  }
  @Get('test')
  test(): ControllerOutputDto<{ salam: string }> {
    this.logger.error('eeeeee');
    this.logger.info('iiiii');
    this.logger.warn('wwww');
    this.logger.debug('ddddd');
    throw new HttpException('salam', HttpStatus.NOT_ACCEPTABLE);
    return new ControllerOutputDto(
      {
        salam: 'HI',
      },
      'salam',
    );
  }

}
