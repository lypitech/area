import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';
import { Area, AreaSchema } from 'src/area/schemas/area.schema';
import { TwitchService } from './twitch.service';
import { TwitchWebhookTriggerDriver } from './twitch.driver';
import { ResponseModule } from 'src/response/response.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Trigger.name, schema: TriggerSchema },
        { name: Oauth.name, schema: OauthSchema },
        { name: Area.name, schema: AreaSchema },
        ]),
        ResponseModule,
        HttpModule,
    ],
    providers: [TwitchService, TwitchWebhookTriggerDriver],
    exports: [TwitchService, TwitchWebhookTriggerDriver],
})
export class TwitchModule {}
