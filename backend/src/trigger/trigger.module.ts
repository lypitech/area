import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trigger, TriggerSchema } from './schemas/trigger.schema';
import { TriggerService } from './trigger.service';
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
