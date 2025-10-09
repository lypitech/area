import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trigger, ActionDocument } from '../../schemas/trigger.schema';
import { AreaService } from '../../../area/area.service';
import { ResponseService } from '../../../response/response.service';

@Injectable()
export class IntervalTriggerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IntervalTriggerService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectModel(Trigger.name) private actionModel: Model<ActionDocument>,
    private readonly areaService: AreaService,
    private readonly reactionService: ResponseService,
  ) {}

  async onModuleInit() {
    const actions = await this.actionModel
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

  async registerInterval(actionUuid: string, everyMinutes: number) {
    const name = `action-interval:${actionUuid}`;

    try {
      this.schedulerRegistry.deleteInterval(name);
    } catch {}

    const ms = Math.max(1, everyMinutes) * 60_000;

    const cb = async () => {
      try {
        const areas =
          await this.areaService.findEnabledByActionUUID(actionUuid);
        if (!areas?.length) return;

        const action_payload = `Tick @ ${new Date().toISOString()} (ts=${Date.now()}) Pierre suce`;

        for (const area of areas) {
          try {
            const reaction = await this.reactionService.getByUUID(
              area.reaction_uuid,
            );
            if (!reaction) throw new Error('Reaction not found');
            const res = await this.reactionService.dispatch(
              reaction,
              action_payload,
            );
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
          `Interval tick failed for action=${actionUuid}: ${e}`,
        );
      }
    };

    const interval = setInterval(cb, ms);
    this.schedulerRegistry.addInterval(name, interval);

    this.logger.log(
      `Registered interval for action=${actionUuid} every ${everyMinutes} min`,
    );
  }

  unregisterInterval(actionUuid: string) {
    const name = `action-interval:${actionUuid}`;
    try {
      this.schedulerRegistry.deleteInterval(name);
      this.logger.log(`Unregistered interval for action=${actionUuid}`);
    } catch {}
  }
}
export { IntervalTriggerService as IntervalService };
