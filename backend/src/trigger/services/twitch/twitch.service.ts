import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { User } from 'src/user/schemas/user.schema';
import { Oauth } from 'src/oauth/schema/Oauth.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TwitchService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Oauth.name) private readonly oauthModel: Model<Oauth>,
    ) {}

    async getTwitchAppToken(): Promise<string> {
        const resp = await firstValueFrom(
        this.httpService.post(
            'https://id.twitch.tv/oauth2/token',
            new URLSearchParams({
            client_id: this.configService.get<string>('TWITCH_CLIENT_ID')!,
            client_secret: this.configService.get<string>('TWITCH_CLIENT_SECRET')!,
            grant_type: 'client_credentials'
            }).toString(),
            {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
        ),
        );

        return resp.data.access_token;
    }

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

        const appToken = await this.getTwitchAppToken();

        const baseUrl = this.configService.get<string>('BASE_URL');
        const callbackUrl = `${baseUrl}/hooks/twitch/${actionId}?token=${actionToken}`;

        const headers = {
        Authorization: `Bearer ${appToken}`,
        'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID')!,
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

        return { id: response.data.data[0].id };
        } catch (error: any) {
        throw new HttpException(
            `Failed to configure Twitch webhook: ${error?.response?.data?.message}`,
            error?.response?.status ?? HttpStatus.BAD_REQUEST,
        );
        }
    }

    async deleteWebhook(subscriptionId: string) {
        const appToken = await this.getTwitchAppToken();

        await axios.delete(
        `https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`,
        {
            headers: {
            Authorization: `Bearer ${appToken}`,
            'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID')!,
            },
        },
        );
    }
}
