import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from './schemas/reaction.schema';

@Injectable()
<<<<<<< HEAD
export class ReactionsService {
=======
export class ReactionService {
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}

<<<<<<< HEAD
  async getAll(): Promise<Reaction[]> {
    return this.reactionModel.find().lean().exec();
  }

  async getByUUID(uuid: string): Promise<Reaction | null> {
    return this.reactionModel.findOne({ uuid }).lean().exec();
  }

  async create(data: Partial<Reaction>): Promise<Reaction> {
    const doc = new this.reactionModel(data);
    const saved = await doc.save();
    return saved.toObject();
  }

  async delete(uuid: string): Promise<{ deleted: true; uuid: string }> {
    const res = await this.reactionModel
      .findOneAndDelete({ uuid })
      .lean()
      .exec();
    if (!res) throw new NotFoundException('Reaction not found');
    return { deleted: true, uuid };
=======
  async findAll(): Promise<Reaction[]> {
    return this.reactionModel.find().exec();
  }

  async findById(id: string): Promise<Reaction> {
    const reaction: Reaction | null = await this.reactionModel
      .findOne({ uuid: id })
      .exec();
    if (!reaction) {
      throw new NotFoundException(`No reaction with uuid ${id} found.`);
    }
    return reaction;
  }

  async createNew(
    service_name: string,
    reaction_name: string,
    description: string,
    payload: string,
  ): Promise<Reaction> {
    const reaction = new this.reactionModel({
      service_name: service_name,
      name: reaction_name,
      description: description,
      payload: payload,
    });
    return reaction.save();
>>>>>>> 2e84b49 (feat(backend>reaction): Added `Reaction` module setup)
  }
}
