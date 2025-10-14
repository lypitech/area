import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trigger } from '../../schemas/trigger.schema';
import { TriggerDriver } from '../../contracts/trigger-driver';
import { AreaService } from '../../../area/area.service';
import { ResponseService } from '../../../response/response.service';

@Injectable()
export class IntervalTriggerDriver
  implements TriggerDriver, OnModuleInit, OnModuleDestroy
{
  readonly key = 'area:interval';
  private readonly logger = new Logger(IntervalTriggerDriver.name);

  constructor(
    private readonly scheduler: SchedulerRegistry,
    @InjectModel(Trigger.name) private triggerModel: Model<Trigger>,
    private readonly areaService: AreaService,
    private readonly responseService: ResponseService,
  ) {}

  supports(trigger: Trigger) {
    return trigger.trigger_type.toLowerCase() === 'interval';
  }

  async onModuleInit() {
    const triggers = await this.triggerModel
      .find({ trigger_type: 'interval' })
      .lean();
    triggers.forEach((t) => this.registerInterval(t));
    this.logger.log(`Loaded ${triggers.length} interval trigger(s).`);
  }

  onModuleDestroy() {
    for (const name of this.scheduler.getIntervals()) {
      this.scheduler.deleteInterval(name);
    }
  }

  onCreate(trigger: Trigger) {
    this.registerInterval(trigger);
    return Promise.resolve();
  }

  onRemove(trigger: Trigger) {
    const name = this.nameOf(trigger);
    try {
      this.scheduler.deleteInterval(name);
    } catch {}
    return Promise.resolve();
  }

  async fire(trigger: Trigger, payload?: any) {
    await this.tick(trigger, payload);
  }

  private nameOf(t: Trigger) {
    return `trigger-interval:${t.uuid}`;
  }

  private registerInterval(t: Trigger) {
    const name = this.nameOf(t);
    try {
      this.scheduler.deleteInterval(name);
    } catch {}
    const ms = Math.max(1, t.input?.every ?? 5) * 60_000;

    const cb = () =>
      this.tick(t).catch((e) =>
        this.logger.error(`Tick failed for ${t.uuid}: ${e}`),
      );
    const interval = setInterval(cb, ms);
    this.scheduler.addInterval(name, interval);
    this.logger.log(`Registered interval ${name} every ${ms / 60000} min`);
  }

  private async tick(t: Trigger, payload?: any) {
    const areas = await this.areaService.findEnabledByTriggerUUID(t.uuid);
    if (!areas) return;
    const trigger_payload =
      payload ?? `Tick @ ${new Date().toISOString()} (ts=${Date.now()})`;
    for (const area of areas) {
      try {
        const response = await this.responseService.findByUUID(
          area.response_uuid,
        );
        if (!response) throw new Error('Reaction not found');
        await this.responseService.dispatch(response, trigger_payload);
        await this.areaService.appendHistory(area.uuid, 'OK (interval)');
      } catch (e: any) {
        await this.areaService.appendHistory(
          area.uuid,
          `ERROR (interval): ${e?.message ?? 'unknown'}`,
        );
      }
    }
  }
}
