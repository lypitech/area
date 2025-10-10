import { Injectable, NotFoundException } from '@nestjs/common';
import { Action, ActionType } from '../schemas/action.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(Action.name)
    private actionModel: Model<Action>,
  ) {}

  getAll(): Promise<Action[]> {
    return this.actionModel.find().exec();
  }

  getByUUID(uuid: string): Promise<Action | null> {
    return this.actionModel.findOne({ uuid: uuid }).lean().exec();
  }

  create(data: ActionType): Promise<Action> {
    const reaction = new this.actionModel(data);
    return reaction.save();
  }

  async remove(uuid: string): Promise<boolean> {
    const deleted: DeleteResult = await this.actionModel.deleteOne({ uuid });
    if (!deleted) {
      throw new NotFoundException(`No action with uuid ${uuid}.`);
    }
    return deleted.deletedCount === 1;
  }
}
