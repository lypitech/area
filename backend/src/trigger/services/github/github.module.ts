import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { GithubWebhookTriggerDriver } from './github.driver';
import { GithubService } from './github.service';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
    MongooseModule.forFeature([{ name: Oauth.name, schema: OauthSchema }]),
  ],
  providers: [GithubService, GithubWebhookTriggerDriver],
  exports: [GithubWebhookTriggerDriver, GithubService],
})
export class GithubModule {}
