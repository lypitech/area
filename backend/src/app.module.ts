import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OauthModule } from './oauth/oauthModule';
import { CommonModule } from './common/common.module';
import { LoginModule } from './login/login.module';
import { ResponseModule } from './response/response.module';
import { ListSeederService } from './list/setup/List.seeder.service';
import { AreaModule } from './area/area.module';
import { TriggerModule } from './trigger/trigger.module';
import {
  ReactionList,
  ReactionListSchema,
} from './list/schemas/reactionList.schema';
import { ActionList, ActionListSchema } from './list/schemas/actionList.schema';
import { HookModule } from './hook/hook.module';
import { ListModule } from './list/list.module';
import {
  ServiceList,
  ServiceListSchema,
} from './list/schemas/serviceList.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/nestdb'),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: ReactionList.name, schema: ReactionListSchema },
      { name: ActionList.name, schema: ActionListSchema },
      { name: ServiceList.name, schema: ServiceListSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    OauthModule,
    CommonModule,
    LoginModule,
    ResponseModule,
    AreaModule,
    TriggerModule,
    HookModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService, ListSeederService],
})
export class AppModule {}
