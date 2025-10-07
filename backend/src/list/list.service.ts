import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ListService {
  // constructor(
  //   @InjectModel(ReactionList.name)
  //   private reactionListModel: Model<ReactionList>,
  // ) {} TODO: create the service list model

  getAll(): [string] {
    return ['github, discord'];
  }

  getByUUID(uuid: string): string {
    return 'github';
  }

  create(data: string): string {
    // const service = new this.serviceListModel(data);
    return 'discord';
  }

  remove(uuid: string): void {
    return;
  }
}
