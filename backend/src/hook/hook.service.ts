import { Injectable, Logger } from '@nestjs/common';
import { TriggerService } from '../trigger/trigger.service';

@Injectable()
export class HookService {
  private readonly logger = new Logger(HookService.name);

  constructor(private readonly triggerService: TriggerService) {}

  async handleGithubWebhook(
    payload: any,
    actionId: string,
    token: string,
    event?: string,
  ) {
    // TODO: Faire un dispatch un peu plus clair ou adapter le système de création
    try {
      this.logger.log(
        `Received GitHub webhook for action ${actionId} (event: ${
          event ?? 'unknown'
        })`,
      );

      const repository = payload?.repository?.name;
      const owner =
        payload?.repository?.owner?.login || payload?.repository?.owner?.name;

      const result = await this.triggerService.fire(actionId, token, {
        repository,
        owner,
        event: event ?? 'push',
        payload,
      });

      this.logger.log(`Successfully processed webhook for action ${actionId}`);
      return result;
    } catch (error: any) {
      this.logger.error(
        `Failed to process webhook for action ${actionId}: ${
          error?.message ?? error
        }`,
      );
      throw error;
    }
  }
}
