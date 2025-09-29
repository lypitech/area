import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action } from './schemas/action.schema';

@Injectable()
export class ActionService {
  constructor(@InjectModel(Action.name) private actionModel: Model<Action>) {}

  findAll() {
    return this.actionModel.find().exec();
  }
  createAction(payload: any) {
    const createdAction = new this.actionModel(payload);
    return createdAction.save();
  }
}
