import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trigger, TriggerSchema } from './schemas/trigger.schema';
import { TriggerService } from './trigger.service';
import { IntervalModule } from './services/interval/interval.module';
import { IntervalTriggerService } from './services/interval/interval.service';
import { AreaService } from '../area/area.service';
import { ResponseService } from '../response/response.service';
import { Area, AreaSchema } from '../area/schemas/area.schema';
import {
  ReactionInstance,
  ResponseSchema,
} from '../response/schemas/response.schema';
import { DiscordReactionService } from '../response/services/discord.service';
import { HttpModule } from '@nestjs/axios';
import { GithubModule } from './services/github/github.module';
import { UserService } from '../user/user.service';
import { OauthService } from '../oauth/oauth.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Oauth, OauthSchema } from '../oauth/schema/Oauth.schema';

@Module({
  imports: [
    HttpModule,
    IntervalModule,
    GithubModule,
    MongooseModule.forFeature([
      { name: Trigger.name, schema: TriggerSchema },
      { name: Area.name, schema: AreaSchema },
      { name: ReactionInstance.name, schema: ResponseSchema },
      { name: User.name, schema: UserSchema },
      { name: Oauth.name, schema: OauthSchema },
    ]),
  ],
  providers: [
    TriggerService,
    IntervalTriggerService,
    AreaService,
    ResponseService,
    DiscordReactionService,
    UserService,
    OauthService,
  ],
  exports: [TriggerService],
})
export class TriggerModule {}
