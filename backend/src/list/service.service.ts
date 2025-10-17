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

  getAll() {
    return this.serviceListModel.find().exec();
  }

  getByUUID(uuid: string) {
    return this.serviceListModel.findOne({ uuid: uuid }).exec();
  }
}
