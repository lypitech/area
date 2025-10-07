import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, ActionDocument } from './schemas/action.schema';
import { AreaService } from '../area/area.service';
import { ReactionService } from '../reaction/reaction.service';
import { GithubService } from './services/github/github.service';
import {
  ActionList,
  ActionListType,
} from '../list/schemas/actionList.schema';

@Injectable()
export class ActionService {
  private readonly logger = new Logger(ActionService.name);

  constructor(
    @InjectModel(Action.name) private actionModel: Model<ActionDocument>,
    private readonly githubService: GithubService,
    private readonly areaService: AreaService,
    private readonly reactionService: ReactionService,
  ) {}

  async getAll() {
    return this.actionModel.find().exec();
  }

  async getByUUID(uuid: string) {
    return this.actionModel.findOne({ uuid }).exec();
  }

  async createAction(data: Partial<Action>): Promise<Action> {
    const newAction = new this.actionModel(data);
    return newAction.save();
  }

  async createActionWithWebhook(action: Partial<Action>, parameters: any) {
    const createdAction = await this.createAction(action);

    if (
      createdAction.service_name === 'github' &&
      createdAction.trigger_type === 'webhook'
    ) {
      const owner = parameters?.owner;
      const repo = parameters?.repo;
      const userId = parameters?.userId;

      if (!owner || !repo || !userId) {
        this.logger.warn(
          `[createActionWithWebhook] Missing GitHub parameters for action ${createdAction.uuid}: owner, repo, userId are required`,
        );
      } else {
        const res = await this.githubService.configureWebhook({
          owner,
          repo,
          userId,
          actionId: createdAction.uuid,
          actionToken: createdAction.token, // secret + token de tir
        });

        if (res?.id != null) {
          await this.actionModel
            .updateOne(
              { uuid: createdAction.uuid },
              { $set: { service_resource_id: String(res.id) } },
            )
            .exec();
        }
      }
    }

    return this.getByUUID(createdAction.uuid);
  }

  async remove(uuid: string): Promise<Action | null> {
    return this.actionModel.findOneAndDelete({ uuid }).exec();
  }

  async fire(uuid: string, token: string, payload: any) {
    const action = await this.actionModel
      .findOne({ uuid })
      .select('+token')
      .lean()
      .exec();

    if (!action) throw new NotFoundException('Action not found');
    if (!token || token !== action.token) {
      throw new UnauthorizedException('Invalid action token');
    }

    const areas = await this.areaService.findEnabledByActionUUID(uuid);
    if (!areas.length) return { fired: true, areas: 0, results: [] };

    const action_payload = JSON.stringify(payload ?? {});
    const results: Array<
      | { area_uuid: string; ok: true; result: any }
      | { area_uuid: string; ok: false; error: string }
    > = [];

    for (const area of areas) {
      try {
        const reaction = await this.reactionService.getByUUID(
          area.reaction_uuid,
        );
        if (!reaction) {
          throw new NotFoundException('Reaction not found');
        }
        const res = this.reactionService.dispatch(
            reaction,
            action_payload
        );
        results.push({ area_uuid: area.uuid, ok: true, result: res });
        await this.areaService.appendHistory(area.uuid, 'OK');
      } catch (e: any) {
        results.push({
          area_uuid: area.uuid,
          ok: false,
          error: e?.message ?? 'error',
        });
        await this.areaService.appendHistory(
          area.uuid,
          `ERROR: ${e?.message ?? 'unknown'}`,
        );
      }
    }
    return { fired: true, areas: areas.length, results };
  }
}
