import 'module-alias/register';

import { AppModule } from './app.module';
import {
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule, SwaggerCustomOptions } from '@nestjs/swagger';
import { rateLimitConstants, serverConstants } from '@constants/index';
import { WLogger } from '@shared/winston/winston.ext';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { join } from 'path';
import { TransformInterceptor, HttpExceptionFilter } from '@shared/interceptors';

// import * as session from 'express-session';
// import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new WLogger(),
  });

  const swaggerOptions = new DocumentBuilder()
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .addBasicAuth()
    .setTitle('TITLE')
    .setDescription('The MRZG API description')
    .setVersion('1.0')
    .build();
  const cso: SwaggerCustomOptions = {};
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, swaggerDoc, cso);

  // For sake of same level dependencies (providers)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  app.use(helmet());

  // app.use(session({ secret: jwtLockConstants.general_key }));
  // app.use(cookieParser());
  // app.use(new csurf({ cookie: true }));

  app.use(new rateLimit(rateLimitConstants));

  //#region GLOBAL PIPES
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    forbidUnknownValues: true,
    whitelist: true,
  }));
  //#endregion

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(morgan(`:method :url :status :response-time`));

  app.useStaticAssets(join(__dirname, '..'));

  app.use(compression());

  app.setGlobalPrefix('api/v1');

  await app.listen(serverConstants.port);
}
bootstrap();
