import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction, ReactionDocument } from './schemas/reaction.schema';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectModel(Reaction.name) private rxModel: Model<ReactionDocument>,
  ) {}

  async getAll() {
    return this.rxModel.find().exec();
  }

  async getOne(uuid: string) {
    return this.rxModel.findOne({ uuid }).exec();
  }

  async create(data: Partial<Reaction>) {
    const doc = new this.rxModel(data);
    const saved = await doc.save();
    return saved.toObject();
  }

  async delete(uuid: string) {
    const res = await this.rxModel.findOneAndDelete({ uuid }).lean().exec();
    if (!res) throw new NotFoundException('Reaction not found');
    return { deleted: true, uuid };
  }
}
