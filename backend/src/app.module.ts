import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthenticationModule } from './services/authentication/authentication.module';
import { UsersProfileModule } from './services/users/profiles.modules';
import { AuthorizationModule } from './services/authorization/authorization.module';
import { mongoConstants } from '@constants/index';
import { EventsModule } from './sockets/events/events.module';

import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { WinstonOptions } from '@shared/winston/winston.logger';

import { TypegooseModule } from 'nestjs-typegoose';

import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from '@shared/termius/termius.service';

@Module({
  imports: [
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
    WinstonModule.forRoot(WinstonOptions),
    TypegooseModule.forRoot(mongoConstants.uri, mongoConstants.options),

    AuthenticationModule,
    AuthorizationModule,

    UsersProfileModule,

    EventsModule,

  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
