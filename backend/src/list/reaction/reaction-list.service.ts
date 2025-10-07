import { Injectable } from '@nestjs/common';
import { ReactionList, ReactionListType } from '../schemas/reactionList.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReactionListService {
  constructor(
    @InjectModel(ReactionList.name)
    private reactionListModel: Model<ReactionList>,
  ) {}

  getAll(): Promise<ReactionList[]> {
    return this.reactionListModel.find().exec();
  }

  getByUUID(uuid: string): Promise<ReactionList | null> {
    return this.reactionListModel.findOne({ uuid: uuid }).lean().exec();
  }

  create(data: ReactionListType): Promise<ReactionList> {
    const reaction = new this.reactionListModel(data);
    return reaction.save();
  }

  async remove(uuid: string): Promise<ReactionList | null> {
    return this.reactionListModel.findOneAndDelete({ uuid: uuid }).exec();
  }
}
