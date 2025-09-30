import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, ActionDocument } from './schemas/action.schemas';

@Injectable()
export class ActionsService {
  constructor(
    @InjectModel(Action.name) private actionModel: Model<ActionDocument>,
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

  async remove(uuid: string): Promise<Action | null> {
    return this.actionModel.findOneAndDelete({ uuid }).exec();
  }
}
