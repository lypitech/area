import { Injectable } from '@nestjs/common';
import { Action } from '../schemas/action.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name)
    private actionModel: Model<Action>,
  ) {}

  getAll(): Promise<Action[]> {
    return this.actionModel.find();
  }

  getByUUID(uuid: string): Promise<Action | null> {
    return this.actionModel.findOne({ uuid: uuid });
  }
}
