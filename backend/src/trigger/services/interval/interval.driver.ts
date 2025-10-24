import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trigger } from 'src/trigger/schemas/trigger.schema';
import { TriggerDriver } from 'src/trigger/contracts/trigger-driver';
import { ResponseService } from 'src/response/response.service';
import { Area } from 'src/area/schemas/area.schema';
import { HistoryDto } from 'src/area/types/historyDto';

@Injectable()
export class IntervalTriggerDriver
  implements TriggerDriver, OnModuleInit, OnModuleDestroy
{
  readonly key = 'area:interval';
  private readonly logger = new Logger(IntervalTriggerDriver.name);

  constructor(
    private readonly scheduler: SchedulerRegistry,
    @InjectModel(Trigger.name) private triggerModel: Model<Trigger>,
    @InjectModel(Area.name) private areaModel: Model<Area>,
    private readonly responseService: ResponseService,
  ) {}

  private findEnabledAreaByTriggerUUID(trigger_uuid: string): Area[] {
    const now = new Date();
    return this.areaModel.find({
      trigger_uuid: trigger_uuid,
      enabled: true,
      $or: [{ disabled_until: null }, { disabled_until: { $lte: now } }],
    }) as unknown as Area[];
  }

  private async appendAreaHistory(area_uuid: string, status: HistoryDto) {
    await this.areaModel.updateOne(
      { uuid: area_uuid },
      { $push: { history: { status } } },
    );
  }

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
    if (this.scheduler.doesExist('interval', name)) {
      this.scheduler.deleteInterval(name);
    }
    return Promise.resolve();
  }

  async fire(trigger: Trigger, payload?: Record<string, any>) {
    await this.tick(trigger, payload);
  }

  private nameOf(t: Trigger) {
    return `trigger-interval:${t.uuid}`;
  }

  private registerInterval(t: Trigger) {
    const name = this.nameOf(t);
    if (this.scheduler.doesExist('interval', name)) {
      this.scheduler.deleteInterval(name);
    }
    const ms = Math.max(1, (t.input?.every as number) ?? 5) * 60_000;

    const interval = setInterval(() => void this.tick(t), ms);
    this.scheduler.addInterval(name, interval);
    this.logger.log(`Registered interval ${name} every ${ms / 60000} min`);
  }

  private async tick(t: Trigger, payload?: Record<string, any>) {
    const areas = this.findEnabledAreaByTriggerUUID(t.uuid);
    if (!areas) return;
    const trigger_payload = payload ?? {
      message: `Tick @ ${new Date().toISOString()} (ts=${Date.now()})`,
    };
    for (const area of areas) {
      const response = await this.responseService.findByUUID(
        area.response_uuid,
      );
      if (!response) throw new NotFoundException('Reaction not found');
      const responseStatus = await this.responseService.dispatch(
        response,
        trigger_payload,
      );
      await this.appendAreaHistory(area.uuid, {
        timestamp: new Date().toISOString(),
        status: responseStatus.ok ? 'ok' : 'ko',
        info: responseStatus.error,
      });
    }
  }
}
