import { Injectable } from '@nestjs/common';
import { Reaction } from '../schemas/reaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name)
    private reactionModel: Model<Reaction>,
  ) {}

  getAll(): Promise<Reaction[]> {
    return this.reactionModel.find().exec();
  }

  getByUUID(uuid: string): Promise<Reaction | null> {
    return this.reactionModel.findOne({ uuid: uuid }).lean().exec();
  }
}
