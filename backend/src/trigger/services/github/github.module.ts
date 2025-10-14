import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from '../../../user/schemas/user.schema';
import { Trigger, TriggerSchema } from '../../schemas/trigger.schema';
import { TRIGGER_DRIVERS } from '../../tokens';
import { GithubWebhookTriggerDriver } from './github.driver';
import { GithubService } from './github.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
  ],
  providers: [GithubService, GithubWebhookTriggerDriver],
  exports: [GithubWebhookTriggerDriver, GithubService],
})
export class GithubModule {}
