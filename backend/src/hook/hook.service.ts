import { Injectable, Logger } from '@nestjs/common';
import { TriggerService } from '../trigger/trigger.service';

@Injectable()
export class HookService {
  private readonly logger = new Logger(HookService.name);

  constructor(private readonly triggerService: TriggerService) {}

  async handleGithubWebhook(
    payload: Record<string, any>,
    actionId: string,
    token: string,
    event?: string,
  ) {
    this.logger.log(
      `Received GitHub webhook for action ${actionId} (event: ${
        event ?? 'unknown'
      })`,
    );

    const repository_name: string | null = payload?.repository?.name;
    const owner: string | null =
      payload?.repository?.owner?.login || payload?.repository?.owner?.name;

    const result = await this.triggerService.fire(actionId, {
      event,
      repository: repository_name,
      owner,
      payload,
    });

    this.logger.log(`Successfully processed webhook for action ${actionId}`);
    return result;
  }

  async handleTwitchWebhook(
    payload: Record<string, any>,
    actionId: string,
    token: string,
    messageType?: string,
  ) {
    const subscriptionType = payload?.subscription?.type;
    const broadcaster = payload?.event?.broadcaster_user_name;
    const isStreamOnlineEvent = subscriptionType === 'stream.online';

    this.logger.log(
      `Twitch webhook received for action=${actionId} messageType=${messageType} subscription=${subscriptionType}`
    );

    if (messageType === 'webhook_callback_verification') {
      const challenge = payload?.challenge;
      this.logger.warn(`Responding challenge for Twitch EventSub validation ✅`);
      return challenge;
    }

    if (!payload?.event) {
      this.logger.warn(`Ignoring webhook without event payload ❌`);
      return { fired: false, reason: 'No event payload' };
    }

    if (!isStreamOnlineEvent) {
      this.logger.warn(`Ignoring event '${subscriptionType}' (we only react to stream.online) ⚠️`);
      return { fired: false, reason: 'Not a stream.online event' };
    }

    return this.triggerService.fire(actionId, {
      event: subscriptionType,
      broadcaster: broadcaster ?? null,
      payload,
    });
  }
}
