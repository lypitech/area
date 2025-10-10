import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceType } from './schemas/service.schema';

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

  create(data: ServiceType) {
    const service = new this.serviceListModel(data);
    return service.save();
  }

  async remove(uuid: string): Promise<boolean> {
    const res = await this.serviceListModel
      .deleteOne({ uuid })
    if (!res) throw new NotFoundException('Service not found');
    return res.deletedCount === 1;
  }
}
