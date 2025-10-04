import { Injectable, Logger } from '@nestjs/common';
import { ActionService } from '../action/action.service';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class HookService {
  private readonly logger = new Logger(HookService.name);

  constructor(private actionService: ActionService) {}

  async handleGithubWebhook(
    payload: any,
    actionId: string,
    user: User,
  ): Promise<void> {
    try {
      this.logger.log(`Received GitHub webhook for action ${actionId}`);

      if (!payload || !payload.repository) {
        throw new Error('Invalid webhook payload');
      }

      await this.actionService.fire(actionId, user.githubToken, {
        repository: payload.repository.name,
        owner: payload.repository.owner.login,
        event: 'push',
        payload: payload,
      });

      this.logger.log(`Successfully processed webhook for action ${actionId}`);
    } catch (error) {
      this.logger.error(`Failed to process webhook: ${error.message}`);
      throw error;
    }
  }
}
