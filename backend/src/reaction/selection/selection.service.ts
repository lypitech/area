import { Injectable } from '@nestjs/common';
import {
  ReactionSelection,
  ReactionSelectionType,
} from '../schemas/reactionSelection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SelectionService {
  constructor(
    @InjectModel(ReactionSelection.name)
    private reactionSelectionModel: Model<ReactionSelection>,
  ) {}

  getAll(): Promise<ReactionSelection[]> {
    return this.reactionSelectionModel.find().exec();
  }

  getByUUID(uuid: string): Promise<ReactionSelection | null> {
    return this.reactionSelectionModel.findOne({ uuid: uuid }).lean().exec();
  }

  create(data: ReactionSelectionType): Promise<ReactionSelection> {
    const reaction = new this.reactionSelectionModel(data);
    return reaction.save();
  }

  async remove(uuid: string): Promise<ReactionSelection | null> {
    return this.reactionSelectionModel.findOneAndDelete({ uuid: uuid }).exec();
  }
}
