import { Injectable, NotFoundException } from '@nestjs/common';
import { Reaction, ReactionType } from '../schemas/reaction.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';

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

  create(data: ReactionType): Promise<Reaction> {
    const reaction = new this.reactionModel(data);
    return reaction.save();
  }

  async remove(uuid: string): Promise<boolean> {
    const deleted: DeleteResult = await this.reactionModel.deleteOne({ uuid });
    if (!deleted) {
      throw new NotFoundException(`No reaction with uuid ${uuid}`);
    }
    return deleted.deletedCount === 1;
  }
}
