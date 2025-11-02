import { Injectable } from '@nestjs/common';
import {
  ActionList,
  ActionListType,
} from '../schemas/actionList.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ActionListService {
  constructor(
    @InjectModel(ActionList.name)
    private actionListModel: Model<ActionList>,
  ) {}

  getAll(): Promise<ActionList[]> {
    return this.actionListModel.find().exec();
  }

  getByUUID(uuid: string): Promise<ActionList | null> {
    return this.actionListModel.findOne({ uuid: uuid }).lean().exec();
  }

  create(data: ActionListType): Promise<ActionList> {
    const reaction = new this.actionListModel(data);
    return reaction.save();
  }

  async remove(uuid: string): Promise<ActionList | null> {
    return this.actionListModel.findOneAndDelete({ uuid: uuid }).exec();
  }
}
