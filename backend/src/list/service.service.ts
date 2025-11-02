import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './schemas/service.schema';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name)
    private serviceListModel: Model<Service>,
  ) {}

  getAll(): Promise<Service[]> {
    return this.serviceListModel.find();
  }

  async getByUUID(uuid: string): Promise<Service | null> {
    return this.serviceListModel.findOne({ uuid: uuid });
  }

  async getActionsByServiceName(name: string) {
    const service = await this.serviceListModel.findOne({ name });
    if (!service) {
      throw new NotFoundException(`Service ${name} not found`);
    }
    const actions: string[] = [];
    for (const action of service.actions) {
      actions.push(action.name);
    }
    return actions;
  }

  async getReactionsByServiceName(name: string) {
    const service = await this.serviceListModel.findOne({ name });
    if (!service) {
      throw new NotFoundException(`Service ${name} not found`);
    }
    const reactions: string[] = [];
    for (const reaction of service.reactions) {
      reactions.push(reaction.name);
    }
    return reactions;
  }
}
