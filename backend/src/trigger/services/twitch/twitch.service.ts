import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Oauth } from 'src/oauth/schema/Oauth.schema';

@Injectable()
export class TwitchService {
    constructor(
        private readonly config: ConfigService,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Oauth.name) private readonly oauthModel: Model<Oauth>,
    ) {}

    private async getAppAccessToken(): Promise<string> {
        const clientId = this.config.get<string>('TWITCH_CLIENT_ID');
        const clientSecret = this.config.get<string>('TWITCH_CLIENT_SECRET');

        const res = await axios.post(
        `https://id.twitch.tv/oauth2/token`,
        null,
        {
            params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
            },
        },
        );

        return res.data.access_token;
    }

    async createEventSubSubscription(params: {
        twitchUserId: string;
        eventType: string;
        actionId: string;
        actionToken: string;
    }): Promise<{ id: string }> {
        const { twitchUserId, eventType, actionId, actionToken } = params;

        const baseUrl =
        this.config.get<string>('BASE_URL') || 'http://localhost:8080';
        const callbackUrl = `${baseUrl.replace(/\/$/, '')}/hooks/twitch/${encodeURIComponent(
        actionId,
        )}?token=${encodeURIComponent(actionToken)}`;
        const clientId = this.config.get<string>('TWITCH_CLIENT_ID');
        const user = await this.userModel.findOne({ uuid: twitchUserId });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const appToken: Oauth | null = await this.oauthModel.findOne({
            uuid: { $in: user.oauth_uuids ?? [] },
            service_name: 'github',
        });
        const body = {
        type: eventType, // ex: "stream.online", "stream.offline", etc.
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
            body,
            {
            headers: {
                'Client-ID': clientId,
                Authorization: `Bearer ${appToken}`,
                'Content-Type': 'application/json',
            },
            },
        );

        return { id: response.data.data[0].id };
        } catch (error: any) {
        const msg =
            error?.response?.data?.message ??
            error?.message ??
            'Erreur Twitch EventSub';
        throw new HttpException(
            `Échec création EventSub: ${msg}`,
            error?.response?.status ?? HttpStatus.BAD_REQUEST,
        );
        }
    }

    async deleteEventSubSubscription(subscriptionId: string): Promise<void> {
        const clientId = this.config.get<string>('TWITCH_CLIENT_ID');
        const appToken = await this.getAppAccessToken();

        await axios.delete(
        `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`,
        {
            headers: {
            'Client-ID': clientId,
            Authorization: `Bearer ${appToken}`,
            },
        },
        );
    }
}
