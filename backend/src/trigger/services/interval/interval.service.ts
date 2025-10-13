import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trigger } from 'src/trigger/schemas/trigger.schema';
import { AreaService } from 'src/area/area.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class IntervalTriggerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IntervalTriggerService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectModel(Trigger.name) private triggerModel: Model<Trigger>,
    private readonly areaService: AreaService,
    private readonly responseService: ResponseService,
  ) {}

  async onModuleInit() {
    const actions = await this.triggerModel
      .find({ trigger_type: 'interval', enabled: true })
      .lean()
      .exec();

    for (const a of actions) {
      const minutes = a.every_minutes ?? 5;
      await this.registerInterval(a.uuid, minutes);
    }

    this.logger.log(`Loaded ${actions.length} interval action(s).`);
  }

  onModuleDestroy() {
    for (const name of this.schedulerRegistry.getIntervals()) {
      this.schedulerRegistry.deleteInterval(name);
    }
  }

  registerInterval(triggerUuid: string, everyMinutes: number) {
    const name = `action-interval:${triggerUuid}`;

    try {
      this.schedulerRegistry.deleteInterval(name);
    } catch (e: any) {
      this.logger.warn('Unknown error happened.');
    }

    const ms = Math.max(1, everyMinutes) * 60_000;

    const cb = async () => {
      try {
        const areas =
          await this.areaService.findEnabledByTriggerUUID(triggerUuid);
        if (!areas) return;

        const trigger_payload = `Tick @ ${new Date().toISOString()} (ts=${Date.now()})`;

        for (const area of areas) {
          try {
            const response = await this.responseService.findByUUID(
              area.response_uuid,
            );
            if (!response) throw new Error('Reaction not found');
            await this.responseService.dispatch(response, trigger_payload);
            await this.areaService.appendHistory(area.uuid, 'OK (interval)');
            this.logger.debug(`Interval fired area=${area.uuid} ok`);
          } catch (e: any) {
            await this.areaService.appendHistory(
              area.uuid,
              `ERROR (interval): ${e?.message ?? 'unknown'}`,
            );
            this.logger.warn(
              `Interval error area=${area.uuid}: ${e?.message ?? e}`,
            );
          }
        }
      } catch (e) {
        this.logger.error(
          `Interval tick failed for action=${triggerUuid}: ${e}`,
        );
      }
    };

    const interval = setInterval(cb, ms);
    this.schedulerRegistry.addInterval(name, interval);

    this.logger.log(
      `Registered interval for action=${triggerUuid} every ${everyMinutes} min`,
    );
  }

  unregisterInterval(actionUuid: string) {
    const name = `action-interval:${actionUuid}`;
    try {
      this.schedulerRegistry.deleteInterval(name);
      this.logger.log(`Unregistered interval for action ${actionUuid}`);
    } catch (error) {
      this.logger.error(
        `Could not unregister trigger ${actionUuid} because of ${error.message}`,
      );
    }
  }
}
export { IntervalTriggerService as IntervalService };
