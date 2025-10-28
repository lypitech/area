import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OauthModule } from './oauth/oauth.module';
import { CommonModule } from './common/common.module';
import { LoginModule } from './login/login.module';
import { ResponseModule } from './response/response.module';
import { SeederService } from './list/setup/seeder.service';
import { AreaModule } from './area/area.module';
import { TriggerModule } from './trigger/trigger.module';
import { Reaction, ReactionSchema } from './list/schemas/reaction.schema';
import { Action, ActionSchema } from './list/schemas/action.schema';
import { HookModule } from './hook/hook.module';
import { ActionModule } from './list/action/action.module';
import { ReactionModule } from './list/reaction/reaction.module';
import { ServiceModule } from './list/service.module';
import { Service, ServiceSchema } from './list/schemas/service.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/nestdb'),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
      { name: Action.name, schema: ActionSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    UserModule,
    OauthModule,
    CommonModule,
    LoginModule,
    ResponseModule,
    AreaModule,
    TriggerModule,
    HookModule,
    ServiceModule,
    ActionModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeederService],
})
export class AppModule {}
