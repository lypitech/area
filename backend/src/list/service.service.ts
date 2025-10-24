import { Injectable } from '@nestjs/common';
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
}
