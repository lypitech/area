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
const DEFAULT_EVENT = 'push';

function normalizeEvent(input?: string): string {
  const v = (input ?? '').trim();
  return v && ALLOWED_EVENTS.has(v) ? v : DEFAULT_EVENT;
}

@Injectable()
export class GithubWebhookTriggerDriver implements TriggerDriver {
  readonly key = 'github:webhook';
  private readonly logger = new Logger(GithubWebhookTriggerDriver.name);

  constructor(
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
    const owner =
      params?.owner?.trim() ??
      (trigger as any)?.input?.owner?.trim() ??
      (trigger as any)?.meta?.owner?.trim();

    const repo =
      params?.repo?.trim() ??
      (trigger as any)?.input?.repo?.trim() ??
      (trigger as any)?.meta?.repo?.trim();

    if (!owner || !repo) {
      throw new BadRequestException(
        'Missing repository coordinates: owner & repo are required',
      );
    }

    const userId =
      (trigger as any)?.user_uuid ??
      (trigger as any)?.userId ??
      (trigger as any)?.user?.uuid;

    if (!userId) {
      throw new BadRequestException('Cannot resolve userId from trigger');
    }

    const actionId = trigger.uuid;

    const actionToken =
      (trigger as any)?.meta?.webhookSecret ??
      (trigger as any)?.meta?.githubWebhookSecret ??
      crypto.randomBytes(32).toString('hex');

    const expectedEvent = normalizeEvent(
      params?.event ??
        (trigger as any)?.input?.event ??
        (trigger as any)?.meta?.event,
    );

    this.logger.debug(
      `onCreate(): owner=${owner} repo=${repo} user=${userId} event=${expectedEvent}`,
    );

    try {
      const { id } = await this.githubService.configureWebhook({
        owner,
        repo,
        userId,
        actionId,
        actionToken,
        event: expectedEvent,
      });

      await this.triggerModel.updateOne(
        { uuid: trigger.uuid },
        {
          $set: {
            meta: {
              ...(trigger as any)?.meta,
              hookId: id,
              owner,
              repo,
              event: expectedEvent,
              webhookSecret: actionToken,
            },
          },
        },
      );
    } catch (e: any) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(
        `Couldn't setup GitHub webhook: ${e?.message ?? 'unknown error'}`,
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
  ): Promise<void> {
    const meta = (trigger as any)?.meta ?? {};
    const owner: string | undefined = _params?.owner ?? meta.owner;
    const repo: string | undefined = _params?.repo ?? meta.repo;
    const hookId: number | undefined = _params?.hookId ?? meta.hookId;

    const userId =
      _params?.userId ??
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
    const incomingEvent =
      (payload?.event as string | undefined) ??
      (payload?.headers?.['x-github-event'] as string | undefined) ??
      null;

    const expectedEvent =
      (trigger as any)?.meta?.event ??
      (trigger as any)?.input?.event ??
      DEFAULT_EVENT;

    const repository =
      (payload?.repository as string | undefined) ??
      payload?.payload?.repository?.name ??
      null;

    const owner =
      (payload?.owner as string | undefined) ??
      payload?.payload?.repository?.owner?.login ??
      payload?.payload?.repository?.owner?.name ??
      null;

    this.logger.debug(
      `fire(): trigger=${trigger.uuid} expected=${expectedEvent} incoming=${incomingEvent ?? 'unknown'} repo=${repository ?? 'unknown'} owner=${owner ?? 'unknown'}`,
    );

    if (incomingEvent && incomingEvent !== expectedEvent) {
      this.logger.debug(
        `fire(): ignoring event "${incomingEvent}" because trigger expects "${expectedEvent}"`,
      );
      return;
    }

    const areas = await this.findEnabledAreaByTriggerUUID(trigger.uuid);
    if (!areas?.length) {
      this.logger.debug(`fire(): no enabled area for trigger ${trigger.uuid}`);
      return;
    }

    const trigger_payload = {
      service: 'github',
      event: expectedEvent,
      repository,
      owner,
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
          const err =
            typeof result.error === 'string'
              ? result.error
              : JSON.stringify(result.error, null, 2);
          this.logger.warn(
            `fire(): response dispatch failed for area=${area.uuid} — ${err}`,
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
