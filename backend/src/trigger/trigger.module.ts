import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trigger, TriggerSchema } from './schemas/trigger.schema';
import { TriggerService } from './trigger.service';
import { TRIGGER_DRIVERS } from './tokens';
import { IntervalModule } from './services/interval/interval.module';
import { IntervalTriggerService } from './services/interval/interval.service';
import { AreaService } from 'src/area/area.service';
import { ResponseService } from 'src/response/response.service';
import { Area, AreaSchema } from 'src/area/schemas/area.schema';
import {
  ReactionInstance,
  ResponseSchema,
} from 'src/response/schemas/response.schema';
import { DiscordReactionService } from 'src/response/services/discord.service';
import { HttpModule } from '@nestjs/axios';
import { GithubModule } from './services/github/github.module';
import { UserService } from 'src/user/user.service';
import { OauthService } from 'src/oauth/oauth.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';
import { IntervalTriggerDriver } from './services/interval/interval.driver';
import { GithubWebhookTriggerDriver } from './services/github/github.driver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trigger.name, schema: TriggerSchema }]),
    IntervalModule,
    GithubModule,
  ],
  providers: [
    TriggerService,
    {
      provide: TRIGGER_DRIVERS,
      useFactory: (
        interval: IntervalTriggerDriver,
        github: GithubWebhookTriggerDriver,
      ) => [interval, github],
      inject: [IntervalTriggerDriver, GithubWebhookTriggerDriver],
    },
  ],
  exports: [TriggerService],
})
export class TriggerModule {}
