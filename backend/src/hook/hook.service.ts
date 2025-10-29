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
    event?: string,
  ) {
    const eventType = payload?.subscription?.type ?? event ?? 'unknown';
    const broadcaster = payload?.event?.broadcaster_user_name ?? 'unknown';
    const user = payload?.event?.user_name ?? null;

    this.logger.log(
      `Received Twitch webhook for action ${actionId} (event: ${eventType}) from broadcaster: ${broadcaster}`,
    );

    const result = await this.triggerService.fire(actionId, {
      event: eventType,
      broadcaster,
      user,
      payload,
    });

    this.logger.log(`Successfully processed Twitch webhook for action ${actionId}`);
    return result;
  }
}
