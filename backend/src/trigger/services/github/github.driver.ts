import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TriggerDriver } from '../../contracts/trigger-driver';
import { Trigger } from '../../schemas/trigger.schema';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../user/schemas/user.schema';
import { GithubService } from './github.service';

type CreateParams = {
  owner: string;
  repo: string;
  userId: string;
  actionId: string;
  actionToken: string;
};

@Injectable()
export class GithubWebhookTriggerDriver implements TriggerDriver {
  readonly key = 'github:webhook';

  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Trigger.name) private readonly triggerModel: Model<Trigger>,
    private readonly githubService: GithubService,
  ) {}

  supports(t: Trigger): boolean {
    return (
      t.service_name.toLowerCase() === 'github' && t.trigger_type === 'webhook'
    );
  }

  /**
   * params attend { owner, repo, userId, actionId, actionToken }
   */
  async onCreate(
    trigger: Trigger,
    params?: Partial<CreateParams>,
  ): Promise<void> {
    if (
      !params?.owner ||
      !params?.repo ||
      !params?.userId ||
      !params?.actionId ||
      !params?.actionToken
    ) {
      throw new BadRequestException(
        'owner, repo, userId, actionId et actionToken are required in params',
      );
    }

    try {
      const { id } = await this.githubService.configureWebhook({
        owner: params.owner,
        repo: params.repo,
        userId: params.userId,
        actionId: params.actionId,
        actionToken: params.actionToken,
      });

      await this.triggerModel.updateOne(
        { uuid: trigger.uuid },
        { $set: { meta: { hookId: id } } },
      );
    } catch (e: any) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        `Couldn't setup github webhook: ${e?.message ?? 'unknown error'}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Si vous avez stocké l’id du webhook, vous pouvez le supprimer ici.
   * params peut contenir { owner, repo, userId, hookId } OU vous lisez depuis trigger.meta
   */
  async onRemove(
    trigger: Trigger,
    params?: {
      owner?: string;
      repo?: string;
      userId?: string;
      hookId?: number;
    },
  ) {
    const owner = params?.owner;
    const repo = params?.repo;
    const userId = params?.userId;
    const hookId = params?.hookId;

    if (!owner || !repo || !userId || !hookId) {
      return;
    }

    try {
      await this.githubService.deleteWebhook({ owner, repo, userId, hookId });
    } catch {
      return;
    }
  }

  async fire(trigger: Trigger, payload?: Record<string, any>): Promise<void> {}
}
