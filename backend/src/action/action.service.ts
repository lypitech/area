import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, ActionDocument } from './schemas/action.schemas';
import {
  ActionSelection,
  ActionSelectionType,
} from './schemas/actionSelection.schema';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name) private actionModel: Model<ActionDocument>,
    @InjectModel(ActionSelection.name)
    private actionSelectionModel: Model<ActionSelection>,
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

  getAllSelection() {
    return this.actionSelectionModel.find().exec();
  }

  getSelectionByUUID(uuid: string) {
    return this.actionSelectionModel.findOne({ uuid: uuid }).exec();
  }

  createActionSelection(data: ActionSelectionType) {
    const newActionSelection = new this.actionSelectionModel(data);
    return newActionSelection.save();
  }

  async removeSelection(uuid: string): Promise<ActionSelection | null> {
    return this.actionSelectionModel.findOneAndDelete({ uuid: uuid }).exec();
  }
}
