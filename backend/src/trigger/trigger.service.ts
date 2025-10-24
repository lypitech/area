import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trigger } from './schemas/trigger.schema';
import { TriggerDriver } from './contracts/trigger-driver';
import { IntervalTriggerDriver } from './services/interval/interval.driver';
import { GithubWebhookTriggerDriver } from './services/github/github.driver';

@Injectable()
export class TriggerService {
  private readonly logger = new Logger(TriggerService.name);
  private readonly drivers: TriggerDriver[];

  constructor(
    @InjectModel(Trigger.name) private triggerModel: Model<Trigger>,
    private readonly intervalDriver: IntervalTriggerDriver,
    private readonly githubDriver: GithubWebhookTriggerDriver,
  ) {
    this.drivers = [this.intervalDriver, this.githubDriver];
  }

  async getAll(): Promise<Trigger[]> {
    return this.triggerModel.find();
  }

  async getByUUID(uuid: string) {
    const trigger: Trigger | null = await this.triggerModel.findOne({ uuid });
    if (!trigger) throw new NotFoundException(`No trigger with uuid ${uuid}`);
    return trigger;
  }

  async create(data: Partial<Trigger>, params?: Record<string, any>) {
    const created = await new this.triggerModel(data).save();
    const driver = this.getDriverFor(created);
    if (driver?.onCreate) await driver.onCreate(created, params);
    return created.uuid;
  }

  async remove(uuid: string) {
    const trigger: Trigger | null = await this.triggerModel.findOne({ uuid });
    if (!trigger) throw new NotFoundException(`No trigger with uuid ${uuid}`);
    const driver = this.getDriverFor(trigger);
    if (driver?.onRemove) await driver.onRemove(trigger);
    await this.triggerModel.deleteOne({ uuid });
    return true;
  }

  async fire(uuid: string, payload?: Record<string, any>) {
    const trigger = await this.getByUUID(uuid);
    const driver = this.getDriverFor(trigger);
    if (!driver?.fire) return { fired: false, reason: 'No driver.fire' };
    await driver.fire(trigger, payload);
    return { fired: true };
  }

  private getDriverFor(trigger: Trigger): TriggerDriver | undefined {
    return this.drivers.find((d) => d.supports(trigger));
  }
}
