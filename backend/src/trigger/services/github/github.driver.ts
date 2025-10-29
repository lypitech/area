import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { TriggerDriver } from '../../contracts/trigger-driver';
import { Trigger } from '../../schemas/trigger.schema';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../user/schemas/user.schema';
import { GithubService } from './github.service';
import crypto from 'crypto';
import { Area } from 'src/area/schemas/area.schema';
import { ResponseService } from 'src/response/response.service';

type CreateParams = {
  owner: string;
  repo: string;
  event?: string;
};

const ALLOWED_EVENTS = new Set<string>(['push', 'pull_request', 'issues']);

function normalizeEvent(input?: string): string {
  const value = (input ?? '').trim();
  if (value && ALLOWED_EVENTS.has(value)) return value;
  return 'push';
}

@Injectable()
export class GithubWebhookTriggerDriver implements TriggerDriver {
  readonly key = 'github:webhook';
  private readonly logger = new Logger(GithubWebhookTriggerDriver.name);

  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Trigger.name) private readonly triggerModel: Model<Trigger>,

    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    private readonly responseService: ResponseService,

    private readonly githubService: GithubService,
  ) {}

  supports(t: Trigger): boolean {
    return (
      t.service_name.toLowerCase() === 'github' && t.trigger_type === 'webhook'
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

  async onCreate(
    trigger: Trigger,
    params?: Partial<CreateParams>,
  ): Promise<void> {
    const owner = params?.owner?.trim();
    const repo = params?.repo?.trim();

    if (!owner || !repo) {
      throw new BadRequestException('Missing params: owner, repo');
    }

    const userId =
      (trigger as any)?.user_uuid ??
      (trigger as any)?.userId ??
      (trigger as any)?.user?.uuid;

    if (!userId) {
      throw new BadRequestException('Cannot resolve userId from trigger');
    }

    const actionId = trigger.uuid;
    const actionToken = crypto.randomBytes(32).toString('hex');

    const event = normalizeEvent(params?.event);
    this.logger.debug(`Configured GitHub webhook event: ${event}`);

    try {
      const { id } = await this.githubService.configureWebhook({
        owner,
        repo,
        userId,
        actionId,
        actionToken,
        event,
      });

      await this.triggerModel.updateOne(
        { uuid: trigger.uuid },
        {
          $set: {
            meta: {
              hookId: id,
              owner,
              repo,
              webhookSecret: actionToken,
              event,
            },
          },
        },
      );
    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
        `Couldn't setup github webhook: ${e?.message ?? 'unknown error'}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async onRemove(
    trigger: Trigger,
    _params?: {
      owner?: string;
      repo?: string;
      userId?: string;
      hookId?: number;
    },
  ) {
    const meta = (trigger as any)?.meta ?? {};
    const owner: string | undefined = meta.owner;
    const repo: string | undefined = meta.repo;
    const hookId: number | undefined = meta.hookId;

    const userId =
      (trigger as any)?.user_uuid ??
      (trigger as any)?.userId ??
      (trigger as any)?.user?.uuid;

    if (!owner || !repo || !hookId || !userId) return;

    try {
      await this.githubService.deleteWebhook({ owner, repo, userId, hookId });
    } catch {
      return;
    }
  }

  async fire(trigger: Trigger, payload?: Record<string, any>): Promise<void> {
    const ghEvent = payload?.event as string | undefined;
    const repo = payload?.repository as string | undefined;
    const owner = payload?.owner as string | undefined;

    this.logger.debug(
      `fire(): trigger=${trigger.uuid} event=${ghEvent ?? 'unknown'} repo=${
        repo ?? 'unknown'
      } owner=${owner ?? 'unknown'}`,
    );

    const areas = await this.findEnabledAreaByTriggerUUID(trigger.uuid);
    if (!areas?.length) {
      this.logger.debug(`fire(): no enabled area for trigger ${trigger.uuid}`);
      return;
    }

    const trigger_payload = {
      service: 'github',
      event: ghEvent ?? (trigger as any)?.meta?.event ?? 'push',
      repository: repo ?? payload?.payload?.repository?.name ?? null,
      owner: owner ?? payload?.payload?.repository?.owner?.login ?? null,
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
