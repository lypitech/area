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

  private async findEnabledAreaByTriggerUUID(
    trigger_uuid: string,
  ): Promise<Area[]> {
    const now = new Date();
    this.logger.debug(
      `Recherche des areas actives pour trigger ${trigger_uuid}`,
    );
    return this.areaModel
      .find({
        trigger_uuid,
        enabled: true,
        $or: [{ disabled_until: null }, { disabled_until: { $lte: now } }],
      })
      .lean()
      .exec();
  }

  private async appendAreaHistory(area_uuid: string, entry: HistoryDto) {
    this.logger.debug(
      `Ajout d'une entrée dans l'historique pour area ${area_uuid}`,
    );
    await this.areaModel.updateOne(
      { uuid: area_uuid },
      { $push: { history: entry } },
    );
  }

  supports(trigger: Trigger) {
    const result = trigger.trigger_type.toLowerCase() === 'interval';
    this.logger.debug(`Support du trigger ${trigger.uuid} : ${result}`);
    return result;
  }

  async onModuleInit() {
    this.logger.debug('Chargement des triggers de type interval...');
    const triggers: Trigger[] = await this.triggerModel
      .find({ trigger_type: 'interval' })
      .exec();
    this.logger.debug(`Nombre de triggers trouvés : ${triggers.length}`);
    triggers.forEach((t) => this.registerInterval(t));
  }

  onModuleDestroy() {
    this.logger.debug('Suppression de tous les intervalles au shutdown.');
    for (const name of this.scheduler.getIntervals()) {
      this.logger.debug(`Suppression de ${name}`);
      this.scheduler.deleteInterval(name);
    }
  }

  onCreate(trigger: Trigger) {
    this.logger.debug(`Création d’un trigger interval : ${trigger.uuid}`);
    this.registerInterval(trigger);
    return Promise.resolve();
  }

  onRemove(trigger: Trigger) {
    const name = this.nameOf(trigger);
    this.logger.debug(`Suppression du trigger interval : ${name}`);
    if (this.scheduler.doesExist('interval', name)) {
      this.scheduler.deleteInterval(name);
    }
    return Promise.resolve();
  }

  async fire(trigger: Trigger, payload?: Record<string, any>) {
    this.logger.debug(`Exécution manuelle du trigger ${trigger.uuid}`);
    await this.tick(trigger, payload);
  }

  private nameOf(t: Trigger) {
    return `trigger-interval:${t.uuid}`;
  }

  private registerInterval(t: Trigger) {
    const name = this.nameOf(t);
    if (this.scheduler.doesExist('interval', name)) {
      this.logger.debug(`Interval ${name} déjà existant — suppression.`);
      this.scheduler.deleteInterval(name);
    }

    const ms = Math.max(1, (t.input?.every_minutes as number) ?? 5) * 60_000;
    this.logger.debug(
      `Création de l’interval ${name} toutes les ${ms / 60000} minutes.`,
    );

    const interval = setInterval(() => {
      this.logger.debug(`Tick automatique pour ${name}`);
      this.tick(t).catch((err) => {
        this.logger.error(`Erreur tick pour ${name}: ${err?.stack ?? err}`);
      });
    }, ms);

    this.scheduler.addInterval(name, interval);
  }

  private async tick(t: Trigger, payload?: Record<string, any>) {
    const name = this.nameOf(t);
    this.logger.debug(`Début tick pour ${name}`);

    const areas = await this.findEnabledAreaByTriggerUUID(t.uuid);
    this.logger.debug(`Areas trouvées : ${areas.length}`);

    if (!areas?.length) return;

    const trigger_payload = payload ?? {
      message: `Tick @ ${new Date().toISOString()}`,
    };

    for (const area of areas) {
      this.logger.debug(`Dispatch vers area ${area.uuid}`);
      const response = await this.responseService.findByUUID(
        area.response_uuid,
      );
      if (!response) {
        this.logger.error(`Aucune réponse trouvée pour area ${area.uuid}`);
        throw new NotFoundException('Response not found');
      }

      const status = await this.responseService.dispatch(
        response,
        trigger_payload,
      );
      this.logger.debug(
        `Dispatch terminé pour area ${area.uuid} avec status : ${JSON.stringify(status)}`,
      );
    }

    this.logger.debug(`Fin tick pour ${name}`);
  }
}
