import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Oauth, OauthSchema } from 'src/oauth/schema/Oauth.schema';
import { Trigger, TriggerSchema } from 'src/trigger/schemas/trigger.schema';
import { TwitchService } from './twitch.service';
import { TwitchWebhookTriggerDriver } from './twitch.driver';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Oauth.name, schema: OauthSchema },
        { name: Trigger.name, schema: TriggerSchema },
        ]),
    ],
    providers: [TwitchService, TwitchWebhookTriggerDriver],
    exports: [TwitchService, TwitchWebhookTriggerDriver],
})
export class TwitchModule {}
