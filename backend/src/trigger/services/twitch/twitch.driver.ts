import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { TriggerDriver } from '../../contracts/trigger-driver';
import { Trigger } from '../../schemas/trigger.schema';
import { TwitchService } from './twitch.service';
import { User } from 'src/user/schemas/user.schema';

type CreateParams = {
    userId: string;
    twitchUserId: string; // id de l’utilisateur Twitch à suivre
    eventType: string; // ex: "stream.online"
    actionId: string;
    actionToken: string;
};

@Injectable()
export class TwitchWebhookTriggerDriver implements TriggerDriver {
    readonly key = 'twitch:webhook';

    constructor(
        private readonly config: ConfigService,
        private readonly twitchService: TwitchService,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Trigger.name) private readonly triggerModel: Model<Trigger>,
    ) {}

    supports(t: Trigger): boolean {
        return (
        t.service_name.toLowerCase() === 'twitch' &&
        t.trigger_type === 'webhook'
        );
    }

    /**
     * Crée un abonnement EventSub sur Twitch.
     */
    async onCreate(trigger: Trigger, params?: Partial<CreateParams>): Promise<void> {
        if (
        !params?.userId ||
        !params?.twitchUserId ||
        !params?.eventType ||
        !params?.actionId ||
        !params?.actionToken
        ) {
        throw new BadRequestException(
            'userId, twitchUserId, eventType, actionId et actionToken sont requis dans params',
        );
        }

        try {
        const subscription = await this.twitchService.createEventSubSubscription({
            twitchUserId: params.twitchUserId,
            eventType: params.eventType,
            actionId: params.actionId,
            actionToken: params.actionToken,
        });

        await this.triggerModel.updateOne(
            { uuid: trigger.uuid },
            { $set: { meta: { subscriptionId: subscription.id } } },
        );
        } catch (e: any) {
        throw new HttpException(
            `Erreur lors de la création du webhook Twitch : ${e?.message ?? 'Erreur inconnue'}`,
            e?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        );
        }
    }

    async onRemove(trigger: Trigger, params?: { subscriptionId?: string }) {
        const subscriptionId = params?.subscriptionId ?? trigger.meta?.subscriptionId;
        if (!subscriptionId) return;

        try {
        await this.twitchService.deleteEventSubSubscription(subscriptionId);
        } catch {
        return;
        }
    }

    async fire(trigger: Trigger, payload?: Record<string, any>): Promise<void> {
        // à implémenter si on veut exécuter une action quand Twitch envoie un event
        console.log(`Twitch Trigger Fired for ${trigger.name}`, payload);
    }
}
