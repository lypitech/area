import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from './schemas/reaction.schema';
import { DiscordReactionService } from './services/discord.service';
import {
  ReactionSelection,
  ReactionSelectionType,
} from 'src/reaction/schemas/reactionSelection.schema';

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
    @InjectModel(ReactionSelection.name)
    private reactionSelectionModel: Model<ReactionSelection>,
    @Inject(DiscordReactionService) private discord: DiscordReactionService,
  ) {}

  async getByUUID(uuid: string): Promise<Reaction | null> {
    return this.reactionModel.findOne({ uuid }).lean().exec();
  }

  async create(data: Partial<Reaction>): Promise<Reaction> {
    const doc = new this.reactionModel(data);
    const saved = await doc.save();
    return saved.toObject();
  }

  async remove(uuid: string): Promise<{ deleted: true; uuid: string }> {
    const res = await this.reactionModel
      .findOneAndDelete({ uuid })
      .lean()
      .exec();
    if (!res) throw new NotFoundException('Reaction not found');
    return { deleted: true, uuid };
  }

  async getAll(): Promise<Reaction[]> {
    return this.reactionModel.find().exec();
  }

  getAllSelection() {
    return this.reactionSelectionModel.find().exec();
  }

  getSelectionByUUID(uuid: string) {
    return this.reactionSelectionModel.findOne({ uuid: uuid }).exec();
  }

  createSelection(data: ReactionSelectionType) {
    const newActionSelection = new this.reactionSelectionModel(data);
    return newActionSelection.save();
  }

  async removeSelection(uuid: string): Promise<ReactionSelection | null> {
    return this.reactionSelectionModel.findOneAndDelete({ uuid: uuid }).exec();
  }

  dispatch(reaction: Reaction, action_payload: string) {
    const service_name: string = (reaction as any).service_name;
    switch (service_name) {
      case 'discord':
        return this.discord.dispatch(reaction, action_payload);
      default:
        throw new NotFoundException(
          `Unsupported reaction service '${service_name}'`,
        );
    }
  }
}
