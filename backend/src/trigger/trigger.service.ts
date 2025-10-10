import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trigger, TriggerType } from './schemas/trigger.schema';
import { GithubService } from './services/github/github.service';
import { IntervalTriggerService } from './services/interval/interval.service';
import { AreaService } from '../area/area.service';
import { ResponseService } from '../response/response.service';

@Injectable()
export class TriggerService {
  private readonly logger = new Logger(TriggerService.name);

  constructor(
    @InjectModel(Trigger.name) private triggerModel: Model<Trigger>,
    private readonly githubService: GithubService,
    private readonly areaService: AreaService,
    private readonly responseService: ResponseService,
    private readonly intervalTrigger: IntervalTriggerService,
  ) {}

  async getAll() {
    return this.triggerModel.find().exec();
  }

  async getByUUID(uuid: string) {
    const trigger: Trigger | null = await this.triggerModel.findOne({ uuid });
    if (!trigger) {
      throw new NotFoundException(`No trigger with uuid ${uuid}`);
    }
    return trigger;
  }

  async create(data: TriggerType): Promise<Trigger> {
    return new this.triggerModel(data).save();
  }

  async remove(uuid: string): Promise<boolean> {
    const removed: Trigger | null = await this.triggerModel.findOneAndDelete({
      uuid,
    });
    if (!removed) {
      throw new NotFoundException(`No trigger with uuid ${uuid}`);
    }
    if (removed.trigger_type === 'interval') {
      this.intervalTrigger.unregisterInterval(uuid);
    }
    return !!removed;
  }

  async createTriggerWithWebhook(trigger: TriggerType, parameters: any) {
    // TODO: Retaper entièrement la fonction, faire un `dispatch` etc
    // const created: Trigger = await this.create(trigger);
    //
    // if (
    //   created.service_name === 'github' &&
    //   created.trigger_type === 'webhook'
    // ) {
    //   const owner = parameters?.owner;
    //   const repo = parameters?.repo;
    //   const userId = parameters?.userId;
    //
    //   if (!owner || !repo || !userId) {
    //     this.logger.warn(
    //       `[createActionWithWebhook] Missing GitHub parameters for action ${created.uuid}: owner, repo, userId are required`,
    //     );
    //   } else {
    //     const res = await this.githubService.configureWebhook({
    //       owner,
    //       repo,
    //       userId,
    //       actionId: created.uuid,
    //       actionToken: created.token,
    //     });
    //
    //     if (res?.id != null) {
    //       await this.triggerModel
    //         .updateOne(
    //           { uuid: created.uuid },
    //           { $set: { service_resource_id: String(res.id) } },
    //         )
    //         .exec();
    //     }
    //   }
    // }
    //
    // if (
    //   created.service_name === 'Area' &&
    //   created.trigger_type === 'interval'
    // ) {
    //   const every =
    //     created.every_minutes ?? parameters?.every_minutes ?? 5;
    //
    //   await this.triggerModel
    //     .updateOne(
    //       { uuid: created.uuid },
    //       {
    //         $set: {
    //           every_minutes: every,
    //         },
    //       },
    //     )
    //     .exec();
    //
    //   // Enregistrer l’interval
    //   const finalAction = await this.getByUUID(created.uuid);
    //   await this.intervalTrigger.registerInterval(created.uuid, every);
    // }
    //
    // return this.getByUUID(created.uuid);
  }

  async fire(uuid: string, token: string, payload: any) {
  //   const action = await this.triggerModel
  //     .findOne({ uuid })
  //     .select('+token')
  //     .lean()
  //     .exec();
  //
  //   if (!action) throw new NotFoundException('Action not found');
  //   if (!token || token !== action.token) {
  //     throw new UnauthorizedException('Invalid action token');
  //   }
  //
  //   const areas = await this.areaService.findEnabledByActionUUID(uuid);
  //   if (!areas.length) return { fired: true, areas: 0, results: [] };
  //
  //   const action_payload = JSON.stringify(payload ?? {});
  //   const results: Array<
  //     | { area_uuid: string; ok: true; result: any }
  //     | { area_uuid: string; ok: false; error: string }
  //   > = [];
  //
  //   for (const area of areas) {
  //     try {
  //       const reaction = await this.responseService.getByUUID(
  //         area.reaction_uuid,
  //       );
  //       if (!reaction) {
  //         throw new NotFoundException('Reaction not found');
  //       }
  //       const res = this.responseService.dispatch(reaction, action_payload);
  //       results.push({ area_uuid: area.uuid, ok: true, result: res });
  //       await this.areaService.appendHistory(area.uuid, 'OK');
  //     } catch (e: any) {
  //       results.push({
  //         area_uuid: area.uuid,
  //         ok: false,
  //         error: e?.message ?? 'error',
  //       });
  //       await this.areaService.appendHistory(
  //         area.uuid,
  //         `ERROR: ${e?.message ?? 'unknown'}`,
  //       );
  //     }
  //   }
  //   return { fired: true, areas: areas.length, results };
  }
}
