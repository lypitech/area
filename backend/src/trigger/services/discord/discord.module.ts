import { Module } from '@nestjs/common';
import { DiscordTriggerDriver } from './discord.driver';
import { ServiceModule } from 'src/list/service.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { Area, AreaSchema } from 'src/area/schemas/area.schema';
import { ResponseModule } from 'src/response/response.module';
import { DiscordTriggerService } from './discord.service';
import { AreaService } from 'src/area/area.service';
import { TriggerService } from 'src/trigger/trigger.service';
import { GithubModule } from 'src/trigger/services/github/github.module';
import { IntervalModule } from 'src/trigger/services/interval/interval.module';
import { OauthService } from 'src/oauth/oauth.service';
import { UserService } from 'src/user/user.service';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';
import { HttpModule } from '@nestjs/axios';
import { TwitchModule } from '../twitch/twitch.module';

@Module({
  imports: [
    HttpModule,
    ServiceModule,
    ResponseModule,
    GithubModule,
    IntervalModule,
    TwitchModule,
    MongooseModule.forFeature([
      { name: Oauth.name, schema: OauthSchema },
      { name: User.name, schema: UserSchema },
      { name: Trigger.name, schema: TriggerSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  providers: [
    UserService,
    OauthService,
    TriggerService,
    AreaService,
    DiscordTriggerService,
    DiscordTriggerDriver,
  ],
  exports: [DiscordTriggerDriver],
})
export class DiscordModule {}
