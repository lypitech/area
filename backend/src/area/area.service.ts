import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from './schemas/area.schema';

@Injectable()
export class AreaService {
  constructor(@InjectModel(Area.name) private areaModel: Model<Area>) {}

  findByUUID(area_uuid: string): Promise<Area | null> {
    return this.areaModel.findOne({ area_uuid }).exec();
  }

  findByActionUuid(action_uuid: string): Promise<Area | null> {
    return this.areaModel.findOne({ action_uuid }).lean().exec();
  }

  findAll(): Promise<Area[]> {
    return this.areaModel.find().exec();
  }

  create(area: Partial<Area>): Promise<Area> {
    const newArea = new this.areaModel(area);
    return newArea.save();
  }

  async deleteByUUID(uuid: string): Promise<boolean> {
    const result = await this.areaModel.deleteOne({ uuid }).exec();
    return result.deletedCount === 1;
  }

  async pushHistory(
    area_uuid: string,
    item: { timestamp: string; status: string },
  ): Promise<void> {
    await this.areaModel.updateOne(
      { uuid: area_uuid },
      { $push: { history: item } },
    );
  }
}
