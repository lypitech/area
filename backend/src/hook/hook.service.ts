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
    this.logger.log(
      `Twitch webhook received for action=${actionId} messageType=${messageType}`
    );

    if (messageType === 'webhook_callback_verification') {
      const challenge = payload?.challenge;
      this.logger.log(`Responding to Twitch verification challenge`);
      return challenge;
    }

    if (!payload?.event || !payload?.subscription?.type) {
      this.logger.warn(`Ignoring webhook without event or subscription type`);
      return { fired: false, reason: 'No valid event payload' };
    }

    const incomingEvent = payload.subscription.type;
    const broadcaster = payload?.event?.broadcaster_user_name ?? 'unknown';

    const trigger = await this.triggerService.findByUUID(actionId);
    if (!trigger) {
      this.logger.error(`Trigger not found for actionId=${actionId}`);
      return { fired: false, reason: 'Trigger not found' };
    }

    this.logger.log(
      `Triggering AREA for event="${incomingEvent}" and broadcaster="${broadcaster}"`
    );

    const result = await this.triggerService.fire(actionId, {
      event: incomingEvent,
      broadcaster,
      payload,
    });

    this.logger.log(`Successfully processed Twitch webhook for ${incomingEvent}`);
    return result;
  }
}
