import { Injectable, BadRequestException, HttpException, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { TriggerDriver } from '../../contracts/trigger-driver';
import { Trigger } from '../../schemas/trigger.schema';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../user/schemas/user.schema';
import { TwitchService } from './twitch.service';
import { Area } from 'src/area/schemas/area.schema';
import { ResponseService } from 'src/response/response.service';
import crypto from 'crypto';

type CreateParams = {
    userId: string;
    actionId: string;
    actionToken: string;
    twitchUserId: string;
    eventType?: string;
};

const DEFAULT_EVENT = 'stream.online';

@Injectable()
export class TwitchWebhookTriggerDriver implements TriggerDriver {
    readonly key = 'twitch:webhook';
    private readonly logger = new Logger(TwitchWebhookTriggerDriver.name);

    constructor(
        private readonly config: ConfigService,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Trigger.name) private readonly triggerModel: Model<Trigger>,
        @InjectModel(Area.name) private readonly areaModel: Model<Area>,
        private readonly responseService: ResponseService,
        private readonly twitchService: TwitchService,
    ) {}

    supports(t: Trigger): boolean {
        return (
        t.service_name.toLowerCase() === 'twitch' && t.trigger_type === 'webhook'
        );
    }

    private async findEnabledAreaByTriggerUUID(
        trigger_uuid: string,
    ): Promise<Area[]> {
        const now = new Date();
        return this.areaModel
        .find({
            trigger_uuid,
            enabled: true,
            $or: [{ disabled_until: null }, { disabled_until: { $lte: now } }],
        })
        .lean()
        .exec();
    }

    async onCreate(trigger: Trigger, _params?: Partial<CreateParams>): Promise<void> {
    const userId =
        (trigger as any)?.user_uuid ??
        (trigger as any)?.userId ??
        (trigger as any)?.user?.uuid;

    const actionId = trigger.uuid;

    const actionToken =
        (trigger as any)?.meta?.webhookSecret ??
        crypto.randomBytes(32).toString('hex');

    const twitchUserId =
        (trigger as any)?.input?.twitchUserId ??
        (trigger as any)?.meta?.twitchUserId;

    if (!userId || !actionId || !actionToken || !twitchUserId) {
        throw new BadRequestException(
        'userId, actionId, actionToken et twitchUserId sont requis (assure-toi de mettre input.twitchUserId dans la création de l’AREA)',
        );
    }

    const eventType =
        (trigger as any)?.input?.event ??
        (trigger as any)?.meta?.eventType ??
        'stream.online';

    try {
        const { id } = await this.twitchService.configureWebhook({
        userId,
        actionId,
        actionToken,
        twitchUserId,
        eventType
        });

        await this.triggerModel.updateOne(
        { uuid: trigger.uuid },
        {
            $set: {
            meta: {
                subscriptionId: id,
                twitchUserId,
                eventType,
                webhookSecret: actionToken,
            },
            },
        },
        );
    } catch (e: any) {
        if (e instanceof HttpException) throw e;
        throw new HttpException(
        `Impossible de configurer le webhook Twitch: ${e?.message ?? 'erreur inconnue'}`,
        HttpStatus.UNAUTHORIZED,
        );
    }
    }

    async onRemove(
        trigger: Trigger,
        params?: { subscriptionId?: string },
    ) {
        const subscriptionId =
        params?.subscriptionId ?? (trigger as any)?.meta?.subscriptionId;
        if (!subscriptionId) return;

        try {
            await this.twitchService.deleteWebhook(subscriptionId);
        } catch {
            return;
        }
    }

    async fire(trigger: Trigger, payload?: Record<string, any>): Promise<void> {
        const eventType = payload?.eventType ?? payload?.subscription?.type ?? (trigger as any)?.meta?.eventType ?? DEFAULT_EVENT;
        const broadcaster = payload?.event?.broadcaster_user_name ?? payload?.broadcaster ?? 'unknown';
        const username = payload?.event?.user_name ?? payload?.user ?? null;

        this.logger.debug(
        `fire(): trigger=${trigger.uuid} event=${eventType} broadcaster=${broadcaster} user=${username ?? 'null'}`,
        );

        const areas = await this.findEnabledAreaByTriggerUUID(trigger.uuid);
        if (!areas?.length) {
        this.logger.debug(`fire(): no enabled area for trigger ${trigger.uuid}`);
        return;
        }

        const trigger_payload = {
        service: 'twitch',
        event: eventType,
        broadcaster,
        user: username,
        raw: payload?.payload ?? payload ?? null,
        trigger_uuid: trigger.uuid,
        trigger_name: trigger.name,
        };

        for (const area of areas) {
        try {
            const response = await this.responseService.findByUUID(
            area.response_uuid,
            );
            if (!response) throw new NotFoundException('Response not found');

            const result = await this.responseService.dispatch(
            response,
            trigger_payload,
            );

            if (!result.ok) {
            this.logger.warn(
                `fire(): response dispatch failed for area=${area.uuid} — ${result.error}`,
            );
            }
        } catch (err: any) {
            this.logger.error(
            `fire(): error while dispatching area=${area.uuid} — ${err?.stack ?? err}`,
            );
        }
        }
    }
}
