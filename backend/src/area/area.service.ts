import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from './schemas/area.schema';
import { Action } from 'src/action/schemas/action.schema';
import { Reaction } from 'src/reaction/schemas/reaction.schema';

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
    @InjectModel(Action.name) private actionModel: Model<Action>,
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}

  findByUUID(uuid: string): Promise<Area | null> {
    return this.areaModel.findOne({ uuid }).exec();
  }

  findByActionUuid(action_uuid: string): Promise<Area[]> {
    return this.areaModel.find({ action_uuid }).lean().exec();
  }

  findAll(): Promise<Area[]> {
    return this.areaModel.find().exec();
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
      action_uuid: dto.action_uuid,
      reaction_uuid: dto.reaction_uuid,
      user_uuid: dto.user_uuid,
      name: dto.name,
      description: dto.description,
      creation_date: new Date().toISOString(),
      enable: dto.enable ?? true,
      disabled_until: dto.disabled_until ?? null,
      history: [],
    };

    const newArea = new this.areaModel(areaData);
    return newArea.save();
  }

  async deleteByUUID(uuid: string): Promise<boolean> {
    const result = await this.areaModel.deleteOne({ uuid }).exec();
    return result.deletedCount === 1;
  }

  async appendHistory(area_uuid: string, status: string) {
    const timestamp = new Date().toISOString();
    await this.areaModel.updateOne(
      { uuid: area_uuid },
      { $push: { history: { timestamp, status } } },
    );
  }

  findEnabledByActionUUID(action_uuid: string) {
    const now = new Date();
    return this.areaModel
      .find({
        action_uuid,
        enable: true,
        $or: [{ disabled_until: null }, { disabled_until: { $lte: now } }],
      })
      .lean()
      .exec();
  }
}
