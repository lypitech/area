import { Injectable, HttpException, HttpStatus, UnauthorizedException, BadRequestException } from '@nestjs/common';
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

    async configureWebhook(params: {
        userId: string;
        actionId: string;
        actionToken: string;
        twitchUserId?: string;
        eventType?: string;
    }): Promise<{ id?: string; raw?: any }> {
        const { userId, actionId, actionToken, eventType } = params;

        const user = await this.userModel.findOne({ uuid: userId });
        if (!user) throw new UnauthorizedException('User not found');
        const oauthUuids = (user.oauth_uuids ?? [])
            .map((o: any) => (typeof o === 'string' ? o : o.token_uuid))
            .filter((v) => typeof v === 'string');
        const twitchOauth = await this.oauthModel.findOne({
            uuid: { $in: oauthUuids },
            service_name: 'twitch',
        });
        if (!twitchOauth) {
            throw new UnauthorizedException('No Twitch OAuth token found for this user');
        }
        const twitchUserId = params.twitchUserId ?? twitchOauth.meta?.twitch_user_id;
        if (!twitchUserId) {
            throw new BadRequestException('Missing Twitch user ID (user did not authorize Twitch properly)');
        }
        const appToken = await this.getTwitchAppToken();
        const baseUrl = this.configService.get<string>('BASE_URL')!;
        const callbackUrl = `${baseUrl.replace(/\/$/, '')}/hooks/twitch/${actionId}?token=${actionToken}`;
        const type = eventType ?? 'stream.online';
        const userScopedEvents = new Set<string>([
            "channel.subscribe",
            "channel.subscription.end",
            "channel.subscription.gift",
            "channel.subscription.message",
            "channel.channel_points_custom_reward.add",
            "channel.channel_points_custom_reward.update",
            "channel.channel_points_custom_reward.remove",
            "channel.channel_points_custom_reward_redemption.add",
            "channel.channel_points_custom_reward_redemption.update",
            "channel.poll.begin",
            "channel.poll.progress",
            "channel.poll.end",
            "channel.prediction.begin",
            "channel.prediction.progress",
            "channel.prediction.lock",
            "channel.prediction.end",
            "channel.moderator.add",
            "channel.moderator.remove",
        ]);
        const needsUserScope = userScopedEvents.has(type);
        const body = {
            type,
            version: '1',
            condition: { broadcaster_user_id: twitchUserId },
            transport: {
            method: 'webhook',
            callback: callbackUrl,
            secret: actionToken,
            },
        };
        const headers: Record<string, string> = {
            'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID')!,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${appToken}`,
        };
        if (needsUserScope && twitchOauth?.token) {
            headers['Twitch-User-Authorization'] = `Bearer ${twitchOauth.token}`;
        }
        try {
            const existing = await axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', { headers });
            const duplicates = existing.data.data.filter(
            (sub: any) => sub.type === type && sub.condition?.broadcaster_user_id === twitchUserId,
            );

            for (const sub of duplicates) {
            console.warn(`Deleting old Twitch subscription ${sub.id} (${sub.type}) for user ${twitchUserId}`);
            try {
                await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`, { headers });
            } catch (err: any) {
                console.warn(`Failed to delete Twitch subscription ${sub.id}: ${err.message}`);
            }
            }
        } catch (cleanupErr: any) {
            console.warn(`Could not fetch or clean old Twitch subscriptions: ${cleanupErr.message}`);
        }
        try {
            const resp = await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', body, { headers });
            return { id: resp.data?.data?.[0]?.id, raw: resp.data };
        } catch (error: any) {
            const twitchError = error?.response?.data;
            console.error('Twitch EventSub Error:', JSON.stringify(twitchError, null, 2));
            throw new HttpException(
            `Failed to configure Twitch webhook: ${
                twitchError?.message || twitchError?.error || 'unknown error'
            }`,
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
