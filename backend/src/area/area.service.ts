import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from './schemas/area.schema';
import { Trigger } from 'src/trigger/schemas/trigger.schema';
import { ReactionInstance } from 'src/response/schemas/response.schema';
import { TriggerService } from '../trigger/trigger.service';
import { ResponseService } from '../response/response.service';

export type CreateAreaDto = {
  action_uuid: string;
  reaction_uuid: string;
  user_uuid: string;
  name: string;
  description?: string;
  enable?: boolean;
  disabled_until?: Date | null;
};

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
    @InjectModel(Trigger.name) private actionModel: Model<Trigger>,
    @InjectModel(ReactionInstance.name)
    private readonly reactionModel: Model<ReactionInstance>,
    private readonly triggerService: TriggerService,
    private readonly responseService: ResponseService,
  ) {}

  findByUUID(
    uuid: string,
    user_uuid: string | null = null,
  ): Promise<Area | null> {
    if (user_uuid) {
      return this.areaModel.findOne({ uuid: uuid, user_uuid: user_uuid });
    }
    return this.areaModel.findOne({ uuid }).exec();
  }

  findByActionUuid(action_uuid: string): Promise<Area[]> {
    return this.areaModel.find({ action_uuid }).lean().exec();
  }

  findAll(user_uuid: string | null = null): Promise<Area[]> {
    if (user_uuid) {
      return this.areaModel.find({ user_uuid: user_uuid }).lean().exec();
    }
    return this.areaModel.find().exec();
  }

  async findTrigger(uuid: string, user_uuid: string | null) {
    const area = await this.findByUUID(uuid, user_uuid);
    if (!area) {
      throw new NotFoundException(`No area with uuid ${uuid}.`);
    }
    return this.triggerService.getByUUID(area.trigger_uuid);
  }

  async findResponse(uuid: string, user_uuid: string | null) {
    const area = await this.findByUUID(uuid, user_uuid);
    if (!area) {
      throw new NotFoundException(`No area with uuid ${uuid}.`);
    }
    return this.responseService.findByUUID(area.response_uuid);
  }

  async create(dto: CreateAreaDto): Promise<Area> {
    const action = await this.actionModel
      .findOne({ uuid: dto.action_uuid })
      .lean()
      .exec();
    if (!action) {
      throw new NotFoundException('Action not found');
    }

    const reaction = await this.reactionModel
      .findOne({ uuid: dto.reaction_uuid })
      .lean()
      .exec();
    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    const areaData: Partial<Area> = {
      trigger_uuid: dto.action_uuid,
      response_uuid: dto.reaction_uuid,
      user_uuid: dto.user_uuid,
      name: dto.name,
      description: dto.description,
      creation_date: new Date().toISOString(),
      enabled: dto.enable ?? true,
      disabled_until: dto.disabled_until ?? null,
      history: [],
    };

    const newArea = new this.areaModel(areaData);
    return newArea.save();
  }

  async remove(uuid: string): Promise<boolean> {
    const result = await this.areaModel.deleteOne({ uuid });
    return result.deletedCount === 1;
  }

  async appendHistory(area_uuid: string, status: string) {
    const timestamp = new Date().toISOString();
    await this.areaModel.updateOne(
      { uuid: area_uuid },
      { $push: { history: { timestamp, status } } },
    );
  }

  findEnabledByActionUUID(trigger_uuid: string) {
    const now = new Date();
    return this.areaModel
      .find({
        trigger_uuid: trigger_uuid,
        enabled: true,
        $or: [{ disabled_until: null }, { disabled_until: { $lte: now } }],
      })
      .lean()
      .exec();
  }
}
