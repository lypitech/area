// src/trigger/drivers/github/github.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { GithubWebhookTriggerDriver } from './github.driver';
import { GithubService } from './github.service';

import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { Area, AreaSchema } from 'src/area/schemas/area.schema';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';
import { ResponseModule } from 'src/response/response.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Trigger.name, schema: TriggerSchema },
      { name: Area.name, schema: AreaSchema },
      { name: Oauth.name, schema: OauthSchema },
    ]),
    ResponseModule,
  ],
  providers: [GithubWebhookTriggerDriver, GithubService],
  exports: [GithubWebhookTriggerDriver, GithubService],
})
export class GithubModule {}
