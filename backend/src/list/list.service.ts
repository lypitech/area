import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceList, ServiceListType } from './schemas/serviceList.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(ServiceList.name)
    private serviceListModel: Model<ServiceList>,
  ) {}

  getAll() {
    return this.serviceListModel.find().exec();
  }

  getByUUID(uuid: string) {
    return this.serviceListModel.findOne({ uuid: uuid }).exec();
  }

  create(data: ServiceListType) {
    const service = new this.serviceListModel(data);
    return service.save();
  }

  async remove(uuid: string) {
    const res = await this.serviceListModel
      .findOneAndDelete({ uuid })
      .lean()
      .exec();
    if (!res) throw new NotFoundException('Service not found');
    return { deleted: true, uuid };
  }
}