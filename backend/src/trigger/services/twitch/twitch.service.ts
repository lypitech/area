import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { User } from 'src/user/schemas/user.schema';
import { Oauth } from 'src/oauth/schema/Oauth.schema';

@Injectable()
export class TwitchService {
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Oauth.name) private readonly oauthModel: Model<Oauth>,
    ) {}

    async configureWebhook(parameters: {
        userId: string;
        actionId: string;
        actionToken: string;
        twitchUserId: string;
        eventType?: string;
    }): Promise<{ id?: string; raw?: any }> {
        const { userId, actionId, actionToken, twitchUserId } = parameters;

        const user = await this.userModel.findOne({ uuid: userId });
        if (!user) throw new UnauthorizedException('User not found');

        const twitchOauth = await this.oauthModel.findOne({
        uuid: { $in: user.oauth_uuids ?? [] },
        service_name: 'twitch',
        });

        const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:8080';
        const callbackUrl = `${baseUrl.replace(/\/$/, '')}/hooks/twitch/${encodeURIComponent(
            actionId,
        )}?token=${encodeURIComponent(actionToken)}`;

        const headers = {
        Authorization: `Bearer ${"4qdij1q257shnsmkvriligt2l1lod8"}`,
        'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID') ?? '',
        'Content-Type': 'application/json',
        };

        const data = {
        type: 'stream.online',
        version: '1',
        condition: {
            broadcaster_user_id: twitchUserId,
        },
        transport: {
            method: 'webhook',
            callback: callbackUrl,
            secret: actionToken,
        },
        };

        try {
        const response = await axios.post(
            'https://api.twitch.tv/helix/eventsub/subscriptions',
            data,
            { headers },
        );

        return { id: response.data?.data?.[0]?.id, raw: response.data };
        } catch (error: any) {
        const message =
            error?.response?.data?.message ??
            error?.message ??
            'unknown Twitch error';
        throw new HttpException(
            `Failed to configure Twitch webhook: ${message}`,
            error?.response?.status ?? HttpStatus.UNAUTHORIZED,
        );
        }
    }

    async deleteWebhook(subscriptionId: string): Promise<void> {
        try {
        const headers = {
            Authorization: `Bearer ${process.env.TWITCH_APP_TOKEN}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID ?? '',
        };

        await axios.delete(
            `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`,
            { headers },
        );
        } catch (error: any) {
        throw new HttpException(
            `Failed to delete Twitch webhook: ${error?.message}`,
            error?.response?.status ?? HttpStatus.BAD_REQUEST,
        );
        }
    }
}
