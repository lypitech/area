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

  async getOne(id: string) {
    return this.actionModel.findById(id).exec();
  }

  async createAction(data: Partial<Action>): Promise<Action> {
    const newAction = new this.actionModel(data);
    return newAction.save();
  }

  async deleteAction(id: string): Promise<Action | null> {
    return this.actionModel.findByIdAndDelete(id).exec();
  }
}
