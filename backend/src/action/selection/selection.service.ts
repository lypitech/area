import { Injectable } from '@nestjs/common';
import {
  ActionSelection,
  ActionSelectionType,
} from '../schemas/actionSelection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ActionSelectionService {
  constructor(
    @InjectModel(ActionSelection.name)
    private actionSelectionModel: Model<ActionSelection>,
  ) {}

  getAll(): Promise<ActionSelection[]> {
    return this.actionSelectionModel.find().exec();
  }

  getByUUID(uuid: string): Promise<ActionSelection | null> {
    return this.actionSelectionModel.findOne({ uuid: uuid }).lean().exec();
  }

  create(data: ActionSelectionType): Promise<ActionSelection> {
    const reaction = new this.actionSelectionModel(data);
    return reaction.save();
  }

  async remove(uuid: string): Promise<ActionSelection | null> {
    return this.actionSelectionModel.findOneAndDelete({ uuid: uuid }).exec();
  }
}
