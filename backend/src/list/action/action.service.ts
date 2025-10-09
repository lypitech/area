import { Injectable } from '@nestjs/common';
import { Action, ActionType } from '../schemas/action.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name)
    private actionListModel: Model<Action>,
  ) {}

  getAll(): Promise<Action[]> {
    return this.actionListModel.find().exec();
  }

  getByUUID(uuid: string): Promise<Action | null> {
    return this.actionListModel.findOne({ uuid: uuid }).lean().exec();
  }

  create(data: ActionType): Promise<Action> {
    const reaction = new this.actionListModel(data);
    return reaction.save();
  }

  async remove(uuid: string): Promise<Action | null> {
    return this.actionListModel.findOneAndDelete({ uuid: uuid }).exec();
  }
}
