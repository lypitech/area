import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from './schemas/reaction.schema';

@Injectable()
export class ReactionsService {
  constructor(@InjectModel(Reaction.name) private rxModel: Model<Reaction>) {}

  async getAll(): Promise<Reaction[]> {
    return this.rxModel.find().lean().exec();
  }

  async getByUUID(uuid: string): Promise<Reaction | null> {
    return this.rxModel.findOne({ uuid }).lean().exec();
  }

  async create(data: Partial<Reaction>): Promise<Reaction> {
    const doc = new this.rxModel(data);
    const saved = await doc.save();
    return saved.toObject();
  }

  async delete(uuid: string): Promise<{ deleted: true; uuid: string }> {
    const res = await this.rxModel.findOneAndDelete({ uuid }).lean().exec();
    if (!res) throw new NotFoundException('Reaction not found');
    return { deleted: true, uuid };
  }
}
